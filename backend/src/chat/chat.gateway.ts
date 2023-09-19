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
import { UserService } from 'src/user/user.service';
import { State } from 'src/user/user.entity';

@WebSocketGateway({
	cors: {
		origin: true,
	}
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly chatService: ChatService,
		private readonly userService: UserService,
	) {}
	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('ChatGateway');

	@SubscribeMessage('message')
	handleMessage(client: Socket, payload: any) {
		const {channelId, text, sender} = payload;
		this.server.emit('message', payload);
		this.logger.log(`message received: ${text}`);
		this.chatService.addMessageToChannel({channelId, text, sender});
		return (payload);
	}

	@SubscribeMessage('changeState')
	handleChangeState(client: Socket, payload: any[]) {
		client.data.user = payload[0];
		this.server.emit('changeState', payload[1]);
		this.userService.changeState(payload[1]['userId'], payload[1]['state']);
		return (payload);
	}

	@SubscribeMessage('kick')
	handleKick(client: Socket, payload: any) {
		this.server.emit('kick', payload);
		return (payload);
	}

	@SubscribeMessage('changeAdmin')
	handleChangeAdmin(client: Socket, payload: any) {
		this.server.emit('changeAdmin', payload[1]);
		return (payload);
	}

	afterInit(server: Server) {
		this.logger.log('Websocket server has started up !');
	}

	async handleDisconnect(client: Socket) {
		this.server.emit('changeState', State.OFFLINE);
		await this.userService.changeState(client.data.user, State.OFFLINE);
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
	}
}