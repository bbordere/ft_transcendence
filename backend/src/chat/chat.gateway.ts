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

@WebSocketGateway({
	cors: {
		origin: true,
	}
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('ChatGateway');

	@SubscribeMessage('message')
	handleMessage(client: Socket, payload: string): string {
		// Need to push message into the database here!
		this.server.emit('message', payload);
		this.logger.log(`message received: ${payload}`);
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