import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, PayloadTooLargeException } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
	cors: {
		origin: true,
	}
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly chatService: ChatService,
	) {}
	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('ChatGateway');

	@SubscribeMessage('message')
	handleMessage(client: Socket, payload: any) {
		this.server.emit('message', payload);
		this.logger.log(`message received: ${payload['text']}`);
		this.chatService.addMessageToChannel(payload)
		return (payload);
	}

	afterInit(server: Server) {
		this.logger.log('Websocket server has started up !');
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
	}
}