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
import { Coords } from './interface/room.interface';
import { Req, UseGuards } from '@nestjs/common';
import { Request } from 'express'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@WebSocketGateway({
	cors: {
	  origin: true,
	},
})

export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
  
	constructor(private pongGame: PongGame) {}
  
	afterInit(server: any) {
		console.log('Serveur up');
	}
  
	handleConnection(client: Socket) {
		console.log(client.handshake.headers)

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
		// const allCookies = cookie.parse(client.handshake.headers.cookie);
		// console.log(cookie.parse);
		const player = {
			socket: client,
			position: { x: 0, y: 0 },
			score: 0,
			user: "",
			room: null,
		};
		console.log(player.user);
		const room = this.pongGame.createRoom();
		this.pongGame.joinRoom(room, player);
	}

	@SubscribeMessage('ready')
	updateBallPosition(client: Socket) {
		console.log("gateway");
	}
}