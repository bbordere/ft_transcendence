import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Coords, Ball, Room, State } from './interface/room.interface';

@Injectable()
export class PongGame {
	private rooms = [];

	createRoom() {
		const room = {
			socket: null,
			state: 'QUEUE',
			mode: 'STANDARD',
			players: [],
			ball: null,
			time: 0,
		};
		this.rooms.push(room);
		return room;
	}

	joinRoom(room, player) {
		if (room.players.length < 2) {
			player.room = room;
			room.players.push(player);
			if (room.players.length === 2) {
				room.state = 'INIT';
				this.initGame(room);
			}
		} else {
			// Gérer le cas où la salle est pleine
		}
	}

	leaveRoom(player) {
		const room = player.room;
		if (room) {
			player.room = null;
			const index = room.players.indexOf(player);
			if (index !== -1) {
				room.players.splice(index, 1);
				if (room.state === 'PLAY' && room.players.length < 2) {
					// Gérer le cas où il ne reste qu'un seul joueur dans la salle en plein jeu
				}
			}
		}
	}

	resetBall(room: Room) {
		room.ball.position.x = 300;
		room.ball.position.y = 300;
	}

	updateBall(client:Socket, room: Room): any {
		room.ball.position.x += 1;
		room.ball.position.y += 1;
		client.emit("ballPosition", room.ball);
	}

	initGame(room: Room) {
		this.resetBall(room);
	}

	playGame(client: Socket, room: Room) {
		this.initGame(room)
		room.state = State.PLAY;
		setInterval(() => {
			this.updateBall(client, room);
		}, 1000/16);
	}
}