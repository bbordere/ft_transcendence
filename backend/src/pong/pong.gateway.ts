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
		// this.logger.log(`Client disconnected: ${client.id}`);
		await this.pongGame.leaveRoomSocket(client.id, client);
		clearInterval(client.data.gameInterval);
		client.disconnect();
	}

	@SubscribeMessage('onJoinGame')
	async handleJoinGame(client: Socket, data: string[]) {
		client.data.user = await this.authService.getUserFromToken(data[0]);
		let player: Player = this.playerMap.get(client.data.user["email"]);
		if (!player){
			player = {
				socket: client,
				score: 0,
				user: client.data.user,
				roomId: -1,
				racket: undefined
			};
			this.playerMap.set(client.data.user["email"], player);
		}
		else
			player.socket = client;
		const room: Room = await this.pongGame.searchRoom(client, player, parseInt(data[1]));
		this.pongGame.playGame(client, room)
		this.pongGame.checkDisconnection(client, room);
	}
}


