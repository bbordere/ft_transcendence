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

interface StateInfo {
	client_socket: Socket;
	state: State;
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
	) { }
	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('ChatGateway');
	private clients: Map<number, StateInfo> = new Map<number, StateInfo>;
	private invites: Map<number, InviteInfo> = new Map<number, InviteInfo>; // invited -> sender

	@SubscribeMessage('message')
	handleMessage(client: Socket, payload: any) {
		const { channelId, text, sender } = payload;
		this.server.emit('message', payload);
		this.logger.log(`message received: ${text}`);
		this.chatService.addMessageToChannel({ channelId, text, sender });
		return (payload);
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
		this.clients.set(payload[0], { client_socket: client, state: payload[1] });
		await this.handleGetStatus(client, payload[0]);
	}

	@SubscribeMessage('kick')
	handleKick(client: Socket, payload: any) {
		this.server.emit('kick', payload);
		return (payload);
	}

	@SubscribeMessage('changeAdmin')
	handleChangeAdmin(client: Socket, payload: any) {
		this.server.emit('changeAdmin', payload);
		return (payload);
	}

	afterInit(server: Server) {
		this.logger.log('Websocket server has started up !');
	}

	async handleDisconnect(client: Socket) {
		// this.clients.set(client.data.userId, {client_socket: client, state: State.OFFLINE});
		this.clients.delete(client.data.userId);
		await this.handleGetStatus(client, client.data.userId);
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	async handleConnection(client: Socket, ...args: any[]) {
		client.data.userId = Number(client.handshake.query['userId']);
		this.clients.set(client.data.userId, { client_socket: client, state: State.ONLINE });
		await this.handleGetStatus(client, client.data.userId);
		this.logger.log(`Client connected: ${client.id}`);
		client.data.canInvite = true;
	}

	@SubscribeMessage('pongInvite')
	async sendPongInvite(client: Socket, payload: any) {
		if (this.invites.get(payload[1]) || this.invites.get(payload[0]) || !client.data.canInvite)
			return;
		this.clients.get(payload[0]).client_socket.emit('displayInvite', true, payload[2], payload[3]);
		this.clients.get(payload[1]).client_socket.emit('displayInvite', false, payload[2], payload[3]);
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
}