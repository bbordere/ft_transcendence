import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Coords, Ball, Mode, Room, State } from './interface/room.interface';

@Injectable()
export class PongGame {
	private rooms = [];

	createRoom(): Room {
		const room: Room = {
			socket: null,
			state: State.QUEUE,
			mode: Mode.standard,
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
		room.ball.position.x = 3;
		room.ball.position.y = 3;
		room.ball.direction.x = 2;
		room.ball.direction.y = 2;
	}

	updateBall(client:Socket, room: Room): any {

		var dx = room.ball.direction.x *2;
		var dy = room.ball.direction.y *2;

		room.ball.position.x += dx;
		room.ball.position.y += dy;
		client.emit("updateBall", room.ball);
	}

	initGame(room: Room) {
		room.ball = new Ball();
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