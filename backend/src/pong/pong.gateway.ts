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
		console.log(client.request.headers)

		console.log(`Un joueur s'est connecté : ${client.id}`);  
		client.on('joinGame', (data: any) => {
			console.log(`Le joueur ${client.id} a rejoint le jeu`);
			client.emit('gameJoined', { playerId: client.id });
			client.broadcast.emit('playerJoined', { playerId: client.id });
		});
	}
  
	handleDisconnect(client: Socket) {
	}
  
	@SubscribeMessage('joinGame')
	handleJoinGame(client: Socket, data: any) {
		console.log("gateway");
		const player = {
			socket: client,
			position: { x: 0, y: 0 },
			score: 0,
			user: client.request.headers["playername"],
			room: null,
		};
		console.log(player.user);
		const room: Room = this.pongGame.createRoom();
		this.pongGame.joinRoom(room, player);
		this.pongGame.playGame(client, room)

	}

	@SubscribeMessage('ready')
	startGame(client: Socket) {
	}
}