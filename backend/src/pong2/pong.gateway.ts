import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
  } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { PongGame } from './pong.service';
import { Coords, Room } from './interface/room.interface';
import { Player } from './interface/player.interface';
import { parse } from 'cookie';
import { AuthService } from 'src/auth/auth.service';
import { Logger, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/user.entity';

@WebSocketGateway(
	{
		namespace: '/pong',
		cors: {
			origin: '*',
			credentials: true
		},
		serveClient: false,
	})
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	// private logger: Logger = new Logger('PongGateway');
  
	constructor(private pongGame: PongGame, private authService: AuthService) {}
  
	async handleConnection(client: Socket) {}

	async handleDisconnect(client: Socket) {
		// this.logger.log(`Client disconnected: ${client.id}`);
		await this.pongGame.leaveRoomSocket(client.id, client);
		client.disconnect();
	}
  
	@SubscribeMessage('onJoinGame')
	async handleJoinGame(client: Socket, data: string) {
		console.log(data);
		client.data.user = await this.authService.getUserFromToken(data);
		console.log(client.data.user);

		// console.log("NAME", client.data.user["name"]);
		// const player: Player = {
		// 	socket: client,
		// 	position: { x: 0, y: 0 },
		// 	score: 0,
		// 	user: client.data.user,
		// };
		// const room: Room = await this.pongGame.searchRoom(client, player);
		// await this.pongGame.playGame(client, room)
		// await this.pongGame.checkDisconnection(client, room);
	}

}

