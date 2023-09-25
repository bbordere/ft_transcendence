import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { State } from 'src/user/user.entity';
import { FriendService } from 'src/friend/friend.service';
import { UserService } from 'src/user/user.service';
import { Channel } from './entities/channel.entity';

interface Mute {
	userId: number,
	time: number,
}

interface StateInfo {
	client_socket: Socket;
	state: State;
	displayUpdate: boolean;
}

interface InviteInfo {
	userId: number;
	mode: string;
}

@WebSocketGateway({
	cors: {
		origin: true,
	}
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly chatService: ChatService,
		private readonly friendService: FriendService,
		private readonly userService: UserService,
	) { }
	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('ChatGateway');
	private clients: Map<number, StateInfo> = new Map<number, StateInfo>;
	private invites: Map<number, InviteInfo> = new Map<number, InviteInfo>; // invited -> sender
	private muteds: Map<number, Mute[]> = new Map<number, Mute[]>;

	private searchMute(userId: number, muted_list: Mute[]): Mute {
		if (!muted_list)
			return (undefined);
		for (let muted of muted_list) {
			if (muted.userId === userId)
				return (muted);
		}
		return (undefined);
	}

	@SubscribeMessage('message')
	async handleMessage(client: Socket, payload: any) {
		let { channelId, text, sender } = payload;
		channelId = Number(channelId);
		text = String(text);
		sender = Number(sender);
		// dubitatif
		const users = await this.chatService.getUsersInChannel(channelId);
		if (!users)
			return (payload);
		const muted = this.muteds.get(channelId);
		const mute_instance = this.searchMute(sender, muted);
		if (!mute_instance) {
			for (let user of users) {
				if (!user.blockList.includes(sender))
					this.clients.get(user.id).client_socket.emit('message', payload);
			}
			this.chatService.addMessageToChannel({ channelId, text, sender });
			this.logger.log(`message received: ${text}`);
		}
		return (payload);
	}

	@SubscribeMessage('mute')
	async handleMute(client: Socket, payload: any) {
		let { userId, channelId, time } = payload;
		userId = Number(userId);
		channelId = Number(channelId);
		time = Number(time);
		const channelOwner = await this.chatService.getChannelOwner(channelId);
		if (userId === channelOwner.id || time < 0) {
			console.log('Cannot mute owner');
			return ;
		}
		if (client.data.userId !== channelOwner.id) {
			console.log("Only the owner of the channel can mute.");
			return ;
		}
		const mute_instance = {
			userId: userId,
			time: time * 1000,
		};
		if (!this.muteds.get(channelId)) {
			let array: Mute[] = [];
			array.push(mute_instance);
			this.muteds.set(channelId, array);
		}
		else
			this.muteds.get(channelId).push(mute_instance);
		let muted = this.muteds.get(channelId);
		setTimeout(() => {
			muted.splice(muted.indexOf(mute_instance), 1);
			console.log('Mute finished');
		}, mute_instance.time);
	}

	@SubscribeMessage('getStatus')
	async handleGetStatus(client: Socket, payload: number) {
		const friends = await this.friendService.getFriendsFromUser(Number(payload));
		if (!friends)
			return;
		for (let friend of friends) {
			const user = this.clients.get(payload);
			if (!user)
				this.clients.get(friend)?.client_socket.emit('getStatus', { userId: payload, state: State.OFFLINE });
			else
				this.clients.get(friend)?.client_socket.emit('getStatus', { userId: payload, state: user.state });
		}
	}

	@SubscribeMessage('setStatus')
	async setStatus(client: Socket, payload: any) {
		this.clients.set(payload[0], { client_socket: client, state: payload[1], displayUpdate: false });
		await this.handleGetStatus(client, payload[0]);
	}

	@SubscribeMessage('kick')
	handleKick(client: Socket, payload: any) {
		console.log(payload);
		// this.server.emit('kick', payload);
		this.clients.get(Number(payload[1])).client_socket.emit('kick', payload);
		return (payload);
	}

	@SubscribeMessage('changeAdmin')
	handleChangeAdmin(client: Socket, payload: any) {
		this.server.emit('changeAdmin', payload);
		return (payload);
	}

	async afterInit(server: Server) {
		// Create world channel
		this.logger.log('Websocket server has started up !');
	}

	handleDisconnect(client: Socket) {
		// this.clients.set(client.data.userId, {client_socket: client, state: State.OFFLINE});
		this.logger.log(`Client disconnected: ${client.id}`);
		if (!this.clients.get(client.data.userId)){
			client.disconnect();
			return;
		}

		this.clients.get(client.data.userId).displayUpdate = true;
		if (this.clients.get(client.data.userId)?.displayUpdate){
			setTimeout(() => {
				if (this.clients.get(client.data.userId)?.displayUpdate){
					this.handleGetStatus(client, client.data.userId);
					this.clients.delete(client.data.userId);
				}
			}, 1000);
		}
		client.disconnect();
	}

	async handleConnection(client: Socket, ...args: any[]) {
		// join new user into the world channel
		client.data.userId = Number(client.handshake.query['userId']);
		if (!this.clients.get(client.data.userId))
			this.clients.set(client.data.userId, { client_socket: client, state: State.ONLINE, displayUpdate: false });
		else
			this.clients.get(client.data.userId).client_socket = client;
		client.data.canInvite = true;
		await this.handleGetStatus(client, client.data.userId);
		this.logger.log(`Client connected: ${client.id}`);
	}

	@SubscribeMessage('pongInvite')
	async sendPongInvite(client: Socket, payload: any) {
		if (this.invites.get(payload[1]) || this.invites.get(payload[0]) || !client.data.canInvite)
			return;
		this.clients.get(payload[0])?.client_socket.emit('displayInvite', true, payload[2], payload[3]);
		this.clients.get(payload[1])?.client_socket.emit('displayInvite', false, payload[2], payload[3]);
		this.invites.set(payload[1], { userId: payload[0], mode: payload[3] });
		client.data.canInvite = false;
	}

	@SubscribeMessage('handlingInvite')
	async pongInviteHandler(client: Socket, payload: any) {
		const inviteInfo: InviteInfo = this.invites.get(client.data.userId);
		if (payload) {
			this.clients.get(inviteInfo.userId).client_socket.emit('joinGame',
				inviteInfo.userId, inviteInfo.mode);
			setTimeout(() => {
				this.clients.get(client.data.userId).client_socket.emit('joinGame',
					inviteInfo.userId, inviteInfo.mode);
			}, 25);
		}
		if (inviteInfo)
			this.clients.get(inviteInfo.userId).client_socket.emit('closeInvite');
		if (this.clients.get(client.data.userId))
			this.clients.get(client.data.userId).client_socket.emit('closeInvite');
		this.invites.delete(client.data.userId);
		client.data.canInvite = true;
	}

	@SubscribeMessage('refreshFriendList')
	async refreshFriendList(client: Socket, payload: string){
		const target = await this.userService.getByName(payload);
		this.clients.get(target.id).client_socket.emit('updateFriendList');
	}

	@SubscribeMessage('refreshFriendListId')
	async refreshFriendListId(client: Socket, payload: number){
		const target = await this.userService.getById(payload);
		this.clients.get(target.id).client_socket.emit('updateFriendList');
	}
}