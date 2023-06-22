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
import { AuthService } from 'src/auth/auth.service';
import { Mode } from 'src/pong/interface/room.interface';

@WebSocketGateway({namespace: '/pong'})
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	private playerMap: Map<string, Player> = new Map<string, Player>;

	// private logger: Logger = new Logger('PongGateway');
  
	constructor(private pongGame: PongGame, private authService: AuthService) {}
  
	async handleConnection(client: Socket) {}

	async handleDisconnect(client: Socket) {
		console.log(client !== undefined);
		// this.logger.log(`Client disconnected: ${client.id}`);
		await this.pongGame.leaveRoomSocket(client.id, client);
		client.disconnect();
	}

	@SubscribeMessage('onJoinGame')
	async handleJoinGame(client: Socket, data: string[]) {
		client.data.user = await this.authService.getUserFromToken(data[0]);
		console.log("EMIL", client.data.user["email"]);

		let player: Player = this.playerMap.get(client.data.user["email"]);
		if (!player){
			console.log("NEW CO")
			player = {
				socket: client,
				position: { x: 0, y: 0 },
				score: 0,
				user: client.data.user,
				roomId: -1
			};
			this.playerMap.set(client.data.user["email"],player);
		}
		else
			player.socket = client;
		const room: Room = await this.pongGame.searchRoom(client, player, parseInt(data[1]));
		await this.pongGame.playGame(client, room)
		await this.pongGame.checkDisconnection(client, room);
	}

}

