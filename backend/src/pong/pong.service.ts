import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Coords, Canvas, Ball, Mode, Room, State } from './interface/room.interface';
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
			canvas: {width: 2000, height:1200}
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
		room.ball.radius = 20
		room.ball.position.x = 150;
		room.ball.position.y = 75;
		room.ball.direction.x = -1;
		room.ball.direction.y = 1;
		room.ball.speed = 2;
	}

	updateBall(client:Socket,  room: Room): any {

		const next = {
			x: room.ball.direction.x * room.ball.speed + room.ball.radius,
			y: room.ball.direction.x * room.ball.speed + room.ball.radius,
		}

		if(room.ball.position.x + next.x > room.canvas.width
				|| room.ball.position.x + next.x < room.ball.radius) {
			room.ball.direction.x *= -1;
		}
		if(room.ball.position.y + next.y > room.canvas.height
				|| room.ball.position.y + next.y < room.ball.radius) {
			room.ball.direction.y *= -1;
		}

		room.ball.position.x += room.ball.direction.x * room.ball.speed;
		room.ball.position.y += room.ball.direction.y * room.ball.speed;
		client.emit("updateBall", room.ball);
	}

	initGame(room: Room) {
		room.ball = new Ball();
		room.canvas.width = 2000;
		room.canvas.height = 1200;
		this.resetBall(room);
	}

	playGame(client: Socket, room: Room) {
			this.initGame(room)
			setInterval(() => {
				if (room.state !== State.QUEUE) {
					room.state = State.PLAY;
					this.updateBall(client, room);
			}
		}, 16);
	}
}