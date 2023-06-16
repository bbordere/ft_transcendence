import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Coords, Ball, Mode, Room, State } from './interface/room.interface';
import { Player } from './interface/player.interface';

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

	joinRoom(client: Socket, room: Room, player: Player): Room {
		if (room.players.length < 2) {
			player.room = room;
			room.players.push(player);
			if (room.players.length === 2) {
				console.log("2 joueur dans la room");
				room.state = State.INIT;
				client.broadcast.emit("roomFull");
			}
			return (room);
		} else {
			// Gérer le cas où la salle est pleine
		}
	}

	searchRoom(client: Socket, player: Player): Room {
	 	for(var i: number = 0; i < this.rooms.length; i++) {
			console.log("recherche");
			if (this.rooms[i].state === State.QUEUE) {
				console.log("trouver");
				return (this.joinRoom(client, this.rooms[i], player));
			}
		}
		console.log("pas trouver");
		const room: Room = this.createRoom();
		return (this.joinRoom(client, room, player));
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
		room.ball.position.x = 35;
		room.ball.position.y = 38;
		room.ball.direction.x = 2;
		room.ball.direction.y = -2;
		room.ball.speed = 1;
	}

	updateBall(client:Socket,  ball: Ball): any {
		var dx = ball.direction.x * ball.speed;
		var dy = ball.direction.y * ball.speed;

		if(ball.position.x + dx + 3 > 600 || ball.position.x + dx - 3 < 0) {
			ball.speed *= -1;
			dy -= dy;
		}
		if(ball.position.y + dy + 3 > 300 || ball.position.y + dy - 3 < 0) {
			ball.speed *= -1;
			dx -= dx;
		}

		ball.position.x += dx;
		ball.position.y += dy;
		client.emit("updateBall", ball);
	}

	initGame(room: Room) {
		room.ball = new Ball();
		this.resetBall(room);
	}

	playGame(client: Socket, room: Room) {
			this.initGame(room)
			setInterval(() => {
				if (room.state !== State.QUEUE) {
					room.state = State.PLAY;
					this.updateBall(client, room.ball);
			}
		}, 1000);
	}
}