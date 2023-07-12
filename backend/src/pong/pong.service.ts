import { Injectable, } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Ball, Mode, Room, State } from './interface/room.interface';
import { Player, Racket } from './interface/player.interface';
import { MatchService } from 'src/match/match.service';
import { UserService } from 'src/user/user.service';
import { MatchDto } from 'src/match/match.dto';

@Injectable()
export class PongGame {

	constructor(private matchService: MatchService){};

	private lastRoomId = 0;
	private roomsMap: Map<Mode, Room[]> = new Map();
	private disconnectedUsers: Map<number, string> = new Map();
	private matchHandlingQueue: Array<MatchDto> = new Array();

	async extractRoom(rooms: Room[]){
		const filteredRooms = rooms.map(room => {
			const { players, ...rest } = room;
			const filteredPlayers = players.map(({ socket, ...player }) => player);
			return { ...rest, players: filteredPlayers };
		  });
		return filteredRooms;
	}

	async hasDisconnect(email: string): Promise<Object> {
		let roomId: number = -1;
		for (let [key, value] of this.disconnectedUsers.entries()) {
			if (value === email){
				roomId = key;
				break;
			}
		}
		return ({status: roomId !== -1, roomId: roomId});
	}

	async getRooms(){
		let res = [];
		const keysArray = Array.from(this.roomsMap.keys());
		for (var key of keysArray){
			res.push(await this.extractRoom(this.roomsMap.get(key)));
		}
		return (res);
	}

	async getRoomById(id: number){
		for (let [key, value] of this.roomsMap) {
			const res = value.find(room => room.id === id);
			if (res)
				return (res);
		}
	}

	async createRoom(mode: Mode): Promise<Room> {
		const room: Room = {
			id: this.lastRoomId++,
			state: State.QUEUE,
			mode: mode,
			players: [],
			ball: null,
			time: 0,
			canvas: {width: 2000, height: 1200}
		};
		this.roomsMap.get(mode).push(room);
		return room;
	}

	async joinRoom(client: Socket, room: Room, player: Player): Promise<Room> {
		if (room.players.length < 2) {
			room.players.push(player);
			if (room.players.length === 2) {
				if (room.state === State.QUEUE)
					room.state = State.INIT;
				player.roomId = room.id;
				client.data.room = room;
			}
			return (room);
		} else {
			player.roomId = room.id;
			client.data.room = room;
			return (room);
			// Gérer le cas où la salle est pleine
		}
	}

	async isSocketInsideRoom(room: Room, socketId: string): Promise<Boolean>{
		const playerNames: string[] = room.players.map((player) => player.socket.id);
		return (playerNames.includes(socketId));
	}

	async isEmailInGame(email: string): Promise<Boolean>{
		const keysArray = Array.from(this.roomsMap.keys());
		for (var key of keysArray){
			for (var room of this.roomsMap.get(key)){
				if (this.isEmailInsideRoom(room, email))
					return (true);
			}
		}
		return (false);
	}

	async isPlayerInsideRoom(room: Room, player: Player): Promise<Boolean>{
		const playerNames: string[] = room.players.map((player) => player.user.email);
		return (playerNames.includes(player.user.email) && room.players.length === 1);
	}

	async isEmailInsideRoom(room: Room, email: string): Promise<Boolean>{
		const playerNames: string[] = room.players.map((player) => player.user.email);
		return (playerNames.includes(email));
	}

	async searchRoom(client: Socket, player: Player, mode: Mode): Promise<Room> {
		if (this.roomsMap.get(mode)){
			for (var room of this.roomsMap.get(mode) as Room[]){
				if ((room.id === player.roomId || room.state === State.QUEUE) && !await this.isPlayerInsideRoom(room, player)){
					console.log("trouver");
					if (this.disconnectedUsers.get(room.id))
						this.disconnectedUsers.delete(room.id);
					return (this.joinRoom(client, room, player));
				}
			}
		}
		else {
			this.roomsMap.set(mode, []);
		}
		console.log("pas trouver");
		const newRoom: Room = await this.createRoom(mode);
		player.roomId = newRoom.id;
		return (this.joinRoom(client, newRoom, player));
	}

	async resetBall(room: Room) {
		room.ball.radius = 20
		room.ball.position.x = 1000;
		room.ball.position.y = 600;
		room.ball.direction.x = (Math.random() * 2 - 1);
		while (room.ball.direction.x < 0.5 && room.ball.direction.x > -0.5)
			room.ball.direction.x = (Math.random() * 2 - 1);
		room.ball.direction.y = (Math.random() - 0.5);
		room.ball.speed = 5;
	}

	async resetRacket(room: Room, keyUp: boolean, keyDown: boolean) {
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
		keyUp = false;
		keyDown = false;
	}

	async updateRacket(client: Socket, room: Room, keyUp: boolean, keyDown: boolean) {
		if (client === room.players[0].socket) {
			if (keyUp) {
				if (room.players[0].racket.top_pos.y > 10)
				room.players[0].racket.top_pos.y -= 10;
				room.players[0].racket.bot_pos.y -= 10;
			}
			if (keyDown) {
				if (room.players[0].racket.top_pos.y < 990)
				room.players[0].racket.top_pos.y += 10;
				room.players[0].racket.bot_pos.y += 10;
			}
		} else if (client === room.players[1].socket) {
			if (keyUp) {
				if (room.players[1].racket.top_pos.y > 10)
				room.players[1].racket.top_pos.y -= 10;
				room.players[1].racket.bot_pos.y -= 10;
			}
			if (keyDown) {
				if (room.players[1].racket.top_pos.y < 990)
				room.players[1].racket.top_pos.y += 10;
				room.players[1].racket.bot_pos.y += 10;
			}
		}
	}

	racketBallCollision(room: Room, racket: Racket) {
		room.ball.direction.x *= -1;
		room.ball.speed++;
		if (room.ball.position.y > racket.top_pos.y && room.ball.position.y < racket.top_pos.y + racket.size / 8)
			room.ball.direction.y = -0.5;
		else if (room.ball.position.y > racket.top_pos.y + racket.size / 8 &&  room.ball.position.y < racket.top_pos.y + 2 * racket.size / 8)
			room.ball.direction.y = -0.375
		else if (room.ball.position.y > racket.top_pos.y + 2 * racket.size / 8 &&  room.ball.position.y < racket.top_pos.y + 3 * racket.size / 8)
			room.ball.direction.y = -0.25
		else if (room.ball.position.y > racket.top_pos.y + 3 * racket.size / 8 &&  room.ball.position.y < racket.top_pos.y + 4 * racket.size / 8)
			room.ball.direction.y = -0.125
		else if (room.ball.position.y > racket.top_pos.y + 4 * racket.size / 8 &&  room.ball.position.y < racket.top_pos.y + 5 * racket.size / 8)
			room.ball.direction.y = 0.125
		else if (room.ball.position.y > racket.top_pos.y + 5 * racket.size / 8 &&  room.ball.position.y < racket.top_pos.y + 6 * racket.size / 8)
			room.ball.direction.y = 0.25
		else if (room.ball.position.y > racket.top_pos.y + 6 * racket.size / 8 &&  room.ball.position.y < racket.top_pos.y + 7 * racket.size / 8)
			room.ball.direction.y = 0.375
		else if (room.ball.position.y > racket.top_pos.y + 7 * racket.size / 8 &&  room.ball.position.y < racket.top_pos.y + racket.size)
			room.ball.direction.y = 0.5;
	}

	updateBall(client:Socket, room: Room, keyUp: boolean, keyDown: boolean) {
		const next = {
			x: room.ball.direction.x * room.ball.speed + room.ball.radius,
			y: room.ball.direction.x * room.ball.speed + room.ball.radius,
		}

		if (room.ball.position.x + next.x > room.canvas.width) {
			room.players[0].score++;
			// if (room.players[0].score == 2) {
			// 	room.state = State.ENDGAME;
			// 	//fonction fin de partie
			// }
			client.emit("updateScore", room.players[0].score, room.players[1].score)
			this.resetBall(room);
			this.resetRacket(room, keyUp, keyDown);
		}
		
		if (room.ball.position.x + next.x < room.ball.radius) {
			room.players[1].score++;
			// if (room.players[1].score == 2) {
			// 	room.state = State.ENDGAME;
			// 	//fonction fin de partie
			// }
			client.emit("updateScore", room.players[1].score, room.players[0].score)
			this.resetBall(room);
			this.resetRacket(room, keyUp, keyDown);
		}

		if (room.ball.position.y + next.y > room.canvas.height
				|| room.ball.position.y + next.y < room.ball.radius) {
			room.ball.direction.y *= -1;
		}

		if (room.ball.position.x + next.x <= room.players[0].racket.top_pos.x + room.players[0].racket.width
					&& room.ball.position.x + next.x >= room.players[0].racket.top_pos.x
					&& room.ball.position.y + next.y <= room.players[0].racket.bot_pos.y + room.ball.radius
					&& room.ball.position.y + next.y >= room.players[0].racket.top_pos.y - room.ball.radius)
		{
			this.racketBallCollision(room, room.players[0].racket)
		}

		if (room.ball.position.x + next.x >= room.players[1].racket.top_pos.x
					&& room.ball.position.x + next.x <= room.players[1].racket.top_pos.x + room.players[1].racket.width
					&& room.ball.position.y + next.y <= room.players[1].racket.bot_pos.y + room.ball.radius
					&& room.ball.position.y + next.y >= room.players[1].racket.top_pos.y - room.ball.radius)
		{
			this.racketBallCollision(room, room.players[1].racket)

		}


		room.ball.position.x += room.ball.direction.x * room.ball.speed;
		room.ball.position.y += room.ball.direction.y * room.ball.speed;
	}

	updateGame(client: Socket, room: Room, keyUp: boolean, keyDown: boolean) {
		this.updateBall(client, room, keyUp, keyDown);
		this.updateRacket(client, room, keyUp, keyDown);
		client.emit("updateGame", room.ball, room.players[0].racket, room.players[1].racket);
	}



	async initGame(room: Room, keyUp:boolean, keyDown: boolean) {
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
			await this.resetRacket(room, keyUp, keyDown);
		room.canvas.width = 2000;
		room.canvas.height = 1200;
	}

	async startTimer(room: Room){
		room.time = 0;
		const it = setInterval(() => {room.time++;}, 1000);
		setTimeout(() => {room.state = State.ENDGAME; clearInterval(it);}, 180 * 1000);
	}

	async playGame(client: Socket, room: Room) {
		var keyUp: boolean = false;
		var keyDown: boolean = false;
		await this.initGame(room, keyUp, keyDown);
		client.on('arrowUpdate', (data) => {
			if (data === "arrowUp")
				keyUp = true;
			else if (data === "stopArrowUp")
				keyUp = false;
			if (data === "arrowDown")
				keyDown = true;
			else if (data === "stopArrowDown")
				keyDown = false;
		});
		// this.startTimer(room); // Timer for time gamemode
		client.data.gameInterval = setInterval(() => {
			if (client.disconnected){
				clearInterval(client.data.gameInterval);
				return;
			}
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
					
						
				case State.ENDGAME:
					clearInterval(client.data.gameInterval);
					client.emit('text', "ENDGAME");
					this.endGame(room);

				case State.PLAY:
					this.updateGame(client, room, keyUp, keyDown);
					break;
				
				default:
					break;
			}
		}, 20);
	}

	async leaveRoomSocket(socketId: string, client: Socket){
		const keysArray = Array.from(this.roomsMap.keys());
		for (var key of keysArray as Mode[]){
			for (var room of this.roomsMap.get(key) as Room[]){
				if (! await this.isSocketInsideRoom(room, socketId))
					continue;
				if (room.players.length === 2){
					room.state = State.WAITING;
					if (this.disconnectedUsers.get(room.id)){
						room.state = State.FINAL;
						this.endGame(room);
					}
					else
						this.disconnectedUsers.set(room.id, client.data.user.email);
				}
				else if (room.players.length === 1){
					room.state = State.FINAL;
				}
			}
		}
	}

	async checkDisconnection(client: Socket, room: Room){
		let countDown: number = 0;
		const it = setInterval(() => {
			console.log(room.players.map((player) => (player.user["name"] + " " + player.score)));
			if (room.state === State.WAITING){
				client.emit('text', "WAITING");
				countDown++;
				if (this.disconnectedUsers.get(room.id) === undefined){
					room.state = State.INIT;
					countDown = 0;
				}
				if (countDown === 10){
					this.endGame(room);
					room.state = State.FINAL;
				}
			}
			if (room.state === State.FINAL){
				countDown = 0;
				const dto: MatchDto = this.matchHandlingQueue.shift();
				if (dto)
					this.matchService.createMatch(dto);
				this.disconnectedUsers.delete(room.id);
				this.roomsMap.set(room.mode, this.roomsMap.get(room.mode).filter((el) => el !== room));
				client.emit('text', "FINISHED");
				clearInterval(client.data.gameInterval);
				clearInterval(it);
			}
			if (room.state === State.PLAY){
				countDown = 0;
			}
		}, 500);
	}

	endGame(room: Room){
		const modes: string[] = ["classic", "arcade", "ranked"];
		const matchDto: MatchDto = {player1Id: room.players[0].user["id"], player2Id: room.players[1].user["id"],
									scorePlayer1: room.players[0].score, scorePlayer2: room.players[1].score,
									mode: modes[room.mode], discoId: -1}
		const discoEmail: string = this.disconnectedUsers.get(room.id);
		if (discoEmail && room.players[0].user["email"] === discoEmail)
			matchDto.discoId = matchDto.player1Id;
		else if (discoEmail && room.players[1].user["email"] === discoEmail)
			matchDto.discoId = matchDto.player2Id;
		if (!this.matchHandlingQueue.some((value) => JSON.stringify(value) === JSON.stringify(matchDto)	)){
			this.matchHandlingQueue.push(matchDto);
		}
		room.players[0].score = 0;
		room.players[1].score = 0;
		setTimeout(function(){room.state = State.FINAL}, 5000);
	}

}