import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Ball, Mode, Room, State } from './interface/room.interface';
import { Player, Racket } from './interface/player.interface';
import { Client } from 'socket.io/dist/client';

@Injectable()
export class PongGame {
	private rooms = [];
	private lastRoomId = 0;

	async createRoom(mode: Mode): Promise<Room> {
		const room: Room = {
			id: this.lastRoomId++,
			state: State.QUEUE,
			mode: mode,
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
			room.players.push(player);
			if (room.players.length === 2) {
				if (room.state === State.QUEUE)
					room.state = State.INIT;
				player.roomId = room.id;
			}
			return (room);
		} else {
			// Gérer le cas où la salle est pleine
		}
	}

	async searchRoom(client: Socket, player: Player, mode: Mode): Promise<Room> {
	 	for (var i: number = 0; i < this.rooms.length; i++) {
			console.log("recherche");
			if (this.rooms[i].id === player.roomId){
				console.log("trouver");
				return (this.joinRoom(client, this.rooms[i], player));
			}
			if (this.rooms[i].state === State.QUEUE && mode === this.rooms[i].mode) {
				console.log("trouver");
				return (this.joinRoom(client, this.rooms[i], player));
			}
		}
		console.log("pas trouver");
		const room: Room = await this.createRoom(mode);
		player.roomId = room.id;
		return (this.joinRoom(client, room, player));
	}

	async resetBall(room: Room) {
		room.ball.radius = 20
		room.ball.position.x = 1000;
		room.ball.position.y = 600;
		room.ball.direction.x = (Math.random() * 2 - 1);
		(room.ball.direction.x % 0.5 == 0) ? room.ball.direction.x * 4 : 1;
		(room.ball.direction.x > 1.1) ? room.ball.direction.x / 2 : 1;
		room.ball.direction.y = (Math.random() * 2 - 1) / 2;
		room.ball.speed = 5;
	}

	async resetRacket(room: Room) {
		if (room.players[0]){
			room.players[0].racket.top_pos.x = 100;
			room.players[0].racket.top_pos.y = 500;
			room.players[0].racket.bot_pos.x = 100;
			room.players[0].racket.bot_pos.y = 700;
			room.players[0].racket.size = 200;
			room.players[0].racket.width = 50;
		}
		if (room.players[1]){
			room.players[1].racket.top_pos.x = 1900;
			room.players[1].racket.top_pos.y = 500;
			room.players[1].racket.bot_pos.x = 1900;
			room.players[1].racket.bot_pos.y = 700;
			room.players[1].racket.size = 200;
			room.players[1].racket.width = 50;
		}
	}

	updateBall(client:Socket,  room: Room) {

		const next = {
			x: room.ball.direction.x * room.ball.speed + room.ball.radius,
			y: room.ball.direction.x * room.ball.speed + room.ball.radius,
		}

		if (room.ball.position.x + next.x > room.canvas.width) {
			room.players[0].score++;
			if (room.players[0].score == 7) {
				;//fonction fin de partie
			}
			client.emit("updateScore", room.players[0].score, room.players[1].score)
			this.resetBall(room);
		}

		if (room.ball.position.x + next.x < room.ball.radius) {
			room.players[1].score++;
			if (room.players[1].score == 7) {
				;//fonction fin de partie
			}
			this.resetBall(room);
		}

		if (room.ball.position.y + next.y > room.canvas.height
				|| room.ball.position.y + next.y < room.ball.radius) {
			room.ball.direction.y *= -1;
		}

		if (room.ball.position.x + next.x <= room.players[0].racket.top_pos.x
				+ room.players[0].racket.width && room.ball.position.y + next.y 
				<= room.players[0].racket.bot_pos.y && room.ball.position.y + next.y
				>= room.players[0].racket.top_pos.y)
		{
			room.ball.direction.x *= -1;
			room.ball.direction.y = (Math.random() * 2 - 1) / 2
			room.ball.speed++;
		}

		if (room.ball.position.x + next.x >= room.players[1].racket.top_pos.x
			+ room.players[1].racket.width && room.ball.position.y + next.y 
			<= room.players[1].racket.bot_pos.y && room.ball.position.y + next.y 
			>= room.players[1].racket.top_pos.y)
	{
		room.ball.direction.x *= -1;
		room.ball.direction.y = (Math.random() * 2 - 1) / 2
		room.ball.speed++;
	}


		room.ball.position.x += room.ball.direction.x * room.ball.speed;
		room.ball.position.y += room.ball.direction.y * room.ball.speed;
	}

	async updateRacket(client: Socket, room: Room, key: any) {
		if (client === room.players[0].socket) {
			if (key === "arrowUp") {
				if (room.players[0].racket.top_pos.y > 10)
				room.players[0].racket.top_pos.y -= 10;
				room.players[0].racket.bot_pos.y -= 10;
			}
			else if (key === "arrowDown") {
				if (room.players[0].racket.top_pos.y < 990)
				room.players[0].racket.top_pos.y += 10;
				room.players[0].racket.bot_pos.y += 10;
			}
		} else if (client === room.players[1].socket) {
			if (key === "arrowUp") {
				if (room.players[1].racket.top_pos.y > 10)
				room.players[1].racket.top_pos.y -= 10;
				room.players[1].racket.bot_pos.y -= 10;
			}
			else if (key === "arrowDown") {
				if (room.players[1].racket.top_pos.y < 990)
				room.players[1].racket.top_pos.y += 10;
				room.players[1].racket.bot_pos.y += 10;
			}
		}
	}

	updateGame(client: Socket, room: Room, key: any) {
		this.updateBall(client, room);
		this.updateRacket(client, room, key);
		client.emit("updateGame", room.ball, room.players[0].racket, room.players[1].racket);
	}

	async initGame(room: Room) {
		if (!room.ball){
			room.ball = new Ball();
			await this.resetBall(room);
		}

		if (!room.players[0].racket)
			room.players[0].racket = new Racket()

		if (room.players[1]){
			if (!room.players[1].racket)
				room.players[1].racket = new Racket()
		}

		if (room.players[1] && room.players[1].racket)
			await this.resetRacket(room);
		room.canvas.width = 2000;
		room.canvas.height = 1200;
	}

	async playGame(client: Socket, room: Room) {
		await this.initGame(room);
		var key: any;
		client.on('arrowUpdate', (data) => {
			key = data;
		});
		client.data.gameInterval = setInterval(() => {
			switch (room.state) {
				case State.QUEUE:
					client.emit('text', "QUEUEING");
					break;
				case State.INIT:{
					if (room.players.length === 2)
						room.state = State.COOLDOWN;
					break;
				}

				case State.COOLDOWN:
					// Handle cooldown
					room.state = State.PLAY;
					break;

				case State.PLAY:
					this.updateGame(client, room, key);
					break;
				
				default:
					break;
			}
		}, 16);
	}

	async leaveRoomSocket(socketId: string, client: Socket){
		for (var room of this.rooms as Room[]){
			if (room.players.length === 2){
				if (room.players[0].socket.id === socketId || room.players[1].socket.id === socketId){
					console.log("STOP INTER", client.data.user["name"]);
					room.players = room.players.filter((element) => element.socket.id !== socketId);
					room.state = State.WAITING;
				}
			}
			else if (room.players.length === 1){
				room.state = State.FINAL;
			}
		}
	}


	async checkDisconnection(client: Socket, room: Room){
		const it = setInterval(() => {
			if (room.state === State.WAITING){
				client.emit('text', "WAITING");
				if (room.players.length == 2){
					room.state = State.INIT;
				}
			}
			if (room.state === State.FINAL){
				clearInterval(client.data.gameInterval);
				clearInterval(it);
				this.rooms = this.rooms.filter((el) => el !== room);
			}

			// if (room.players.length === 1 && room.state === State.PLAY){
			// 	console.log("STOPPING", client.data.user["name"]);
			// 	clearInterval(client.data.gameInterval);
			// 	clearInterval(it);
			// 	client.disconnect();
			// }
		}, 1000);
	}
}