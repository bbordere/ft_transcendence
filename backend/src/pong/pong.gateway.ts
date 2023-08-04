import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
  } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { RoomService } from './room.service';
import { GameService } from './game.service';
import { Player } from './interface/player.interface';
import { Room } from './interface/room.interface';

@WebSocketGateway({namespace: '/pong'})
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	private playerMap: Map<string, Player> = new Map<string, Player>;

	// // private logger: Logger = new Logger('PongGateway');
  
	constructor(private gameService: GameService, private authService: AuthService, private roomService: RoomService) {}
  
	async handleConnection(client: Socket) {}

	async handleDisconnect(client: Socket) {
		// this.logger.log(`Client disconnected: ${client.id}`);
		await this.roomService.leaveRoomSocket(client.id, client);
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
				racket: undefined,
				nbPowerups: 0,
			};
			this.playerMap.set(client.data.user["email"], player);
		}
		else
			player.socket = client;
		const room: Room = await this.roomService.searchRoom(client, player, parseInt(data[1]));
		this.gameService.keyHandling(client, room)
	}
}


