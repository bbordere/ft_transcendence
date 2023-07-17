import { Injectable, } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Ball, Mode, Room, State } from './interface/room.interface';
import { Player, Racket } from './interface/player.interface';
import { MatchService } from 'src/match/match.service';
import { MatchDto } from 'src/match/match.dto';

@Injectable()
export class PongGame {

	constructor(private matchService: MatchService){
		setInterval(() => {
			const keysArray = Array.from(this.roomsMap.keys());
			for (var key of keysArray as Mode[]){
				for (var room of this.roomsMap.get(key) as Room[]){
					if (!this.checkedRooms.has(room)){
						this.checkRoom(room);
						this.checkedRooms.add(room);
					}
				}
			}
		}, 200)
	};

	private lastRoomId = 0;
	private roomsMap: Map<Mode, Room[]> = new Map();
	private disconnectedUsers: Map<number, string> = new Map();
	private checkedRooms: Set<Room> = new Set();

	async extractRoom(rooms: Room[]){
		const filteredRooms = rooms.map(room => {
			const { players, timerInterval, timerTimeout, gameInterval, ...rest } = room;
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
			canvas: {width: 2000, height: 1200},
			timerInterval: null,
			timerTimeout: null,
			gameInterval: null,
			isFinished: false,
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

	updateBall(client: Socket, room: Room, keyUp: boolean, keyDown: boolean) {
		const next = {
			x: room.ball.direction.x * room.ball.speed + room.ball.radius,
			y: room.ball.direction.x * room.ball.speed + room.ball.radius,
		}

		if (room.ball.position.x + next.x > room.canvas.width) {
			room.players[0].score++;
			if (room.mode === Mode.ranked && room.players[0].score == 7) {
				room.state = State.ENDGAME;
				return;
				//fonction fin de partie
			}
			this.resetBall(room);
			this.resetRacket(room, keyUp, keyDown);
			room.state = State.COOLDOWN;
			return;
		}
		
		if (room.ball.position.x + next.x < room.ball.radius) {
			room.players[1].score++;
			if (room.mode === Mode.ranked && room.players[1].score == 7) {
				room.state = State.ENDGAME;
				return;
				//fonction fin de partie
			}
			this.resetBall(room);
			this.resetRacket(room, keyUp, keyDown);
			room.state = State.COOLDOWN;
			return;
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

	updateGame(client: Socket, room: Room) {
		this.updateBall(client, room, client.data.keyUp, client.data.keyDown);
		this.updateRacket(client, room, client.data.keyUp, client.data.keyDown);
		client.emit("updateGame", room.ball, room.players[0].racket, room.players[1].racket);
	}



	async initGame(room: Room, keyUp:boolean, keyDown: boolean) {
		if (!room.ball){
			room.ball = new Ball();
			await this.resetBall(room);
		}

		room.players[0].score = 0;
		if (!room.players[0].racket)
			room.players[0].racket = new Racket()
		
		if (room.players[1]){
			room.players[1].score = 0;
			if (!room.players[1].racket)
				room.players[1].racket = new Racket()
		}

		if (room.players[1] && room.players[1].racket)
			await this.resetRacket(room, keyUp, keyDown);
		room.canvas.width = 2000;
		room.canvas.height = 1200;
	}

	formatTime(total: number): string{
		const minutes = Math.floor(total / 60);
		const seconds = total % 60;	  
		const formattedMinutes = String(minutes).padStart(2, "0");
		const formattedSeconds = String(seconds).padStart(2, "0");
		return `${formattedMinutes}:${formattedSeconds}`;
	}

	async startTimer(room: Room){
		if (room.players.length != 2)
			return;
		room.timerInterval = setInterval(() => {
			room.time++;
			room.players[0].socket.emit('time', this.formatTime(room.time));
			room.players[1].socket.emit('time', this.formatTime(room.time));
		}, 1000);
		if (room.mode !== Mode.ranked){
			room.timerTimeout = setTimeout(() => {
				room.state = State.ENDGAME;
				clearInterval(room.timerInterval);
			}, (181 - room.time) * 1000);
		}

	}

	async playGame(room: Room){
		console.log("GAME STARTED");
		await this.initGame(room, false, false);
		this.startTimer(room);
		let cooldown: number = 0;
		room.gameInterval = setInterval(() => {
			switch (room.state) {
				case State.INIT: {
					room.state = State.COOLDOWN;
				}
				break;

				case State.COOLDOWN: {
					this.emitToPlayers(room, "updateScore", room.players[0].score, room.players[1].score);
					this.emitToPlayers(room, "updateGame", room.ball, room.players[0].racket, room.players[1].racket);
					if (room.timerInterval){
						clearInterval(room.timerInterval);
						clearTimeout(room.timerTimeout);
					}
					if (cooldown < 120)
						cooldown++;
					else {
						cooldown = 0;
						room.state = State.PLAY;
						this.startTimer(room);
					}
				}
				break;

				case State.ENDGAME: {
					clearInterval(room.gameInterval);
					clearInterval(room.timerInterval);
					this.emitToPlayers(room, 'text', "ENDGAME");
				}
				break;

				case State.PLAY: {
					cooldown = 0;
					this.updateGame(room.players[0].socket, room);
					this.updateGame(room.players[1].socket, room);
				}
				break;

			}
		}, 20)
	}

	async keyHandling(client: Socket, room: Room) {
		var keyUp: boolean = false;
		var keyDown: boolean = false;
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

		const it = setInterval(() => {
			if (room.isFinished)
				clearInterval(it);
			client.data.keyDown = keyDown;
			client.data.keyUp = keyUp;
		}, 20)
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
						room.state = State.ENDGAME;
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

	async emitToPlayers(room: Room, event: string, ...args: any[]){
		room.players[0].socket.emit(event, ...args);
		if (room.players[1])
			room.players[1].socket.emit(event, ...args);
	}

	async checkRoom(room: Room){
		let countDown: number = 0;
		let isStarted: boolean = false;
		const it = setInterval(() => {
			if (!isStarted && room.players.length === 2){
				isStarted = true;
				this.playGame(room);
			}
			switch (room.state) {
				case State.WAITING: {
					if (room.timerInterval){
						clearInterval(room.timerInterval);
						clearTimeout(room.timerTimeout);
						room.timerInterval = null;
					}

					this.emitToPlayers(room, 'text', 'WAITING');
					countDown++;
					if (this.disconnectedUsers.get(room.id) === undefined){
						room.state = State.INIT;
						countDown = 0;
					}
					if (countDown === 200){
						room.state = State.ENDGAME;
					}
				}
				break;

				case State.ENDGAME: {
					if (countDown < 200)
						countDown++
					else
						this.endGame(room);
				}
				break;

				case State.FINAL: {
					countDown = 0;
					this.disconnectedUsers.delete(room.id);
					this.roomsMap.set(room.mode, this.roomsMap.get(room.mode).filter((el) => el !== room));
					this.emitToPlayers(room, 'text', "FINISHED");
					clearInterval(room.players[0].socket.data.gameInterval);
					if (room.players[1]){
						clearInterval(room.players[1].socket.data.gameInterval);
					}
					clearInterval(it);
					room.isFinished = true;
				}
				break;

				case State.PLAY: {
					countDown = 0;
				}
				break;

				case State.QUEUE: {
					this.emitToPlayers(room, 'text', "QUEUEING");
				}
				break;

				default:
					break;
			}
		}, 20);
	}

	async endGame(room: Room){
		if (room.players.length != 2)
			return;
		const modes: string[] = ["classic", "arcade", "ranked"];
		const matchDto: MatchDto = {player1Id: room.players[0].user["id"], player2Id: room.players[1].user["id"],
									scorePlayer1: room.players[0].score, scorePlayer2: room.players[1].score,
									mode: modes[room.mode], leaverId: -1}
		const leaverEmail: string = this.disconnectedUsers.get(room.id);
		if (leaverEmail && room.players[0].user["email"] === leaverEmail)
			matchDto.leaverId = matchDto.player1Id;
		else if (leaverEmail && room.players[1].user["email"] === leaverEmail)
			matchDto.leaverId = matchDto.player2Id;
		this.matchService.createMatch(matchDto, room.mode === Mode.ranked);
		room.state = State.FINAL;
	}

}