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


@WebSocketGateway({
	cors: {
	  origin: "http://localhost:8080",
	},
})
	
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
  
	constructor(private pongGame: PongGame) {}
  
	afterInit(server: any) {
		console.log('Serveur up');
	}

	handleConnection(client: Socket) {
		console.log(`Un joueur s'est connecté : ${client.id}`);
	}
  
	handleDisconnect(client: Socket) {
		client.disconnect();
	}
  
	@SubscribeMessage('joinGame')
	handleJoinGame(client: Socket, data: any) {
		const player: Player = {
			socket: client,
			position: { x: 0, y: 0 },
			score: 0,
			user: client.request.headers["playername"],
			room: null,
		};
		const room: Room = this.pongGame.searchRoom(client, player);
		this.pongGame.playGame(client, room)

	}

}