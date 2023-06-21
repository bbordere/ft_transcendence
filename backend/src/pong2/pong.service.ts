import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Coords, Canvas, Ball, Mode, Room, State } from './interface/room.interface';
import { Player } from './interface/player.interface';

@Injectable()
export class PongGame {
	private rooms = [];
	private gameInterval;

	async createRoom(client: Socket): Promise<Room> {
		const room: Room = {
			socket: client,
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

	async joinRoom(client: Socket, room: Room, player: Player): Promise<Room> {
		if (room.players.length < 2) {
			// player.room = room;
			room.players.push(player);
			if (room.players.length === 2) {
				console.log("2 joueur dans la room", room.players);
				room.state = State.INIT;
				client.broadcast.emit("roomFull");
			}
			return (room);
		} else {
			// Gérer le cas où la salle est pleine
		}
	}

	async searchRoom(client: Socket, player: Player): Promise<Room> {
	 	for(var i: number = 0; i < this.rooms.length; i++) {
			console.log("recherche");
			if (this.rooms[i].state === State.QUEUE) {
				console.log("trouver");
				return (this.joinRoom(client, this.rooms[i], player));
			}
		}
		console.log("pas trouver");
		const room: Room = await this.createRoom(client);
		return (this.joinRoom(client, room, player));
	}

	// async leaveRoom(player) {
	// 	const room = player.room;
	// 	if (room) {
	// 		player.room = null;
	// 		const index = room.players.indexOf(player);
	// 		if (index !== -1) {
	// 			room.players.splice(index, 1);
	// 			if (room.state === 'PLAY' && room.players.length < 2) {
	// 				// Gérer le cas où il ne reste qu'un seul joueur dans la salle en plein jeu
	// 			}
	// 		}
	// 	}
	// }

	async resetBall(room: Room) {
		room.ball.radius = 20
		room.ball.position.x = 150;
		room.ball.position.y = 75;
		room.ball.direction.x = -1;
		room.ball.direction.y = 1;
		room.ball.speed = 2;
	}

	updateBall(client:Socket,  room: Room) {

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

	async initGame(room: Room) {
		room.ball = new Ball();
		room.canvas.width = 2000;
		room.canvas.height = 1200;
		await this.resetBall(room);
	}

	async playGame(client: Socket, room: Room) {
		await this.initGame(room);
		client.data.gameInterval = setInterval(() => {
			if (room.players.length === 2)
				room.state = State.PLAY;
			if (room.state === State.PLAY) {
				this.updateBall(client, room);
			}
		}, 25);
	}

	async leaveRoomSocket(socketId: string, client: Socket){
		for (var room of this.rooms as Room[]){
			// console.log("DECO", client.data.user["name"]);
			if (room.players[0].socket.id === socketId || room.players[1].socket.id === socketId){
				console.log("STOP INTER", client.data.user["name"]);
				room.players = room.players.filter((element) => element.socket.id !== socketId);
				clearInterval(client.data.gameInterval);
			}
			if (!room.players.length)
				this.rooms = this.rooms.filter((el) => el !== room);
		}
	}

	async checkDisconnection(client: Socket, room: Room){
		const it = setInterval(() => {
			// console.log("CHECK DECO");
			// console.log(room.players.length === 1 && room.state === State.PLAY);
			if (room.players.length === 1 && room.state === State.PLAY){
				console.log("STOPPING", client.data.user["name"]);
				clearInterval(client.data.gameInterval);
				clearInterval(it);
				client.disconnect();
			}
		}, 1000);
	}
}