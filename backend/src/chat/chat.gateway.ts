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

@WebSocketGateway({
	cors: {
		origin: true,
	}
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly chatService: ChatService,
		private readonly friendService: FriendService,
	) {}
	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('ChatGateway');
	private clients: Map<number, StateInfo> = new Map<number, StateInfo>;

	@SubscribeMessage('message')
	handleMessage(client: Socket, payload: any) {
		const {channelId, text, sender} = payload;
		this.server.emit('message', payload);
		this.logger.log(`message received: ${text}`);
		this.chatService.addMessageToChannel({channelId, text, sender});
		return (payload);
	}

	@SubscribeMessage('getStatus')
	async handleGetStatus(client: Socket, payload: number) {
		const friends = await this.friendService.getFriendsFromUser(Number(payload));
		for (let friend of friends) {
			const user = this.clients.get(payload);
			if (!user)
				this.clients.get(friend)?.client_socket.emit('getStatus', {userId: payload, state: State.OFFLINE});
			else
				this.clients.get(friend)?.client_socket.emit('getStatus', {userId: payload, state: user.state});
		}
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
		this.clients.set(client.data.userId, {client_socket: client, state: State.ONLINE});
		await this.handleGetStatus(client, client.data.userId);
		this.logger.log(`Client connected: ${client.id}`);
	}
	
	@SubscribeMessage('pongInvite')
	async sendPongInvite(client: Socket, payload: any){
		console.log(payload);
		// client.emit('displayInvite');
		this.clients.get(payload[0]).client_socket.emit('displayInvite', true, payload[2]);
		this.clients.get(payload[1]).client_socket.emit('displayInvite', false, payload[2]);
	}
}