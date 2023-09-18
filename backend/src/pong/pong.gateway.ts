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
import { Room, State } from './interface/room.interface';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({namespace: '/pong'})
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	private playerMap: Map<string, Player> = new Map<string, Player>;

	// // private logger: Logger = new Logger('PongGateway');
	constructor(private readonly gameService: GameService, 
				private readonly authService: AuthService,
				private readonly roomService: RoomService,
				private readonly userService: UserService) {}
  
	async handleConnection(client: Socket) {}

	async handleDisconnect(client: Socket) {
		// this.logger.log(`Client disconnected: ${client.id}`);
		await this.roomService.leaveRoomSocket(client.id, client);
		clearInterval(client.data.gameInterval);
		client.disconnect();
	}

	@SubscribeMessage('onJoinGame')
	async handleJoinGame(client: Socket, data: string[]) {
		console.log(data);
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
		await this.roomService.searchRoom(client, player, parseInt(data[1]), parseInt(data[2]));
		this.gameService.keyHandling(client)
	}

	@SubscribeMessage('emote')
	async handleEmote(client: Socket, emoji: string){
		const room: Room = client.data.room;
		if (!room)
			return;
		client.data.user.stats.totalEmotes += 1;
		this.userService.saveUser(client.data.user);
		if (room.players[0] && room.players[0].socket === client)
			this.roomService.emitToPlayers(room, "emote", 0, emoji)
		else
			this.roomService.emitToPlayers(room, "emote", 1, emoji)
	}
}


