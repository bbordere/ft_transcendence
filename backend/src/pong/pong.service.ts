import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Ball, Mode, Room, State } from './interface/room.interface';
import { Racket } from './interface/racket.interface';
import { RoomService } from 'src/pong/room.service'
import { Effect, Powerup } from './interface/powerup.interface';

import { PongConstants } from './interface/constants.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PongGame {
	
	constructor(private roomService: RoomService, private readonly userService: UserService) {}

	resetBall(room: Room) {
		room.ball.radius = 20;
		room.ball.position.x = PongConstants.CANVAS_WIDTH / 2;
		room.ball.position.y = PongConstants.CANVAS_HEIGHT / 2;
		room.ball.direction.x = (Math.random() * 2 - 1);
		while (room.ball.direction.x < 0.5 && room.ball.direction.x > -0.5)
			room.ball.direction.x = (Math.random() * 2 - 1);
		room.ball.direction.y = (Math.random() - 0.5);
		room.ball.speed = PongConstants.MIN_BALL_SPEED;
		room.ball.lastHit = -1;
	}

	resetRacket(room: Room) {
		if (room.players[0]){
			room.players[0].racket.pos.x = (PongConstants.RACKET_WIDTH);
			room.players[0].racket.pos.y = (PongConstants.CANVAS_HEIGHT / 2) - (PongConstants.RACKET_HEIGHT / 2);
			room.players[0].racket.size = PongConstants.RACKET_HEIGHT;
			room.players[0].racket.width = PongConstants.RACKET_WIDTH;
			if (room.players[0].racket.effectTimeout){
				clearTimeout(room.players[0].racket.effectTimeout);
				room.players[0].racket.effectTimeout = null;
			}
		}
		if (room.players[1]){
			room.players[1].racket.pos.x = (PongConstants.CANVAS_WIDTH - (PongConstants.RACKET_WIDTH * 2));
			room.players[1].racket.pos.y = (PongConstants.CANVAS_HEIGHT / 2) - (PongConstants.RACKET_HEIGHT / 2);
			room.players[1].racket.size = PongConstants.RACKET_HEIGHT;
			// room.players[1].racket.size = 2000;
			room.players[1].racket.width = PongConstants.RACKET_WIDTH;
			if (room.players[1].racket.effectTimeout){
				clearTimeout(room.players[1].racket.effectTimeout);
				room.players[1].racket.effectTimeout = null;
			}
		}
	}

	racketHandling(racket: Racket, room: Room, dy: number){
		if (this.hasRacketIntersect(room.ball, racket))
			return;
		const canMove: Boolean = ((dy > 0 && racket.pos.y + racket.size < room.canvas.height - room.ball.radius) || (dy < 0 && racket.pos.y > room.ball.radius));
		racket.pos.y += dy * Number(canMove);
	}

	getRacketDirection(keyUp: Boolean, keyDown: Boolean): number {
		return (keyUp && !keyDown ? -1 : keyDown && !keyUp ? 1 : 0);
	}

	updateRacket(client: Socket, room: Room, keyUp: boolean, keyDown: boolean) {
		if (client === room.players[0].socket) {
			this.racketHandling(room.players[0].racket, room, this.getRacketDirection(keyUp, keyDown) * room.players[0].racket.speed);
		} else if (client === room.players[1].socket) {
			this.racketHandling(room.players[1].racket, room, this.getRacketDirection(keyUp, keyDown) * room.players[1].racket.speed);
		}
	}

	racketBallCollision(room: Room, racket: Racket, playerHit: number) {
		if (room.ball.lastHit === playerHit)
			return;
		room.ball.lastHit = playerHit;
		const offset = (room.ball.position.y + room.ball.radius - racket.pos.y) / (racket.size + room.ball.radius)
		const angle = (1 / 4) * Math.PI * (2 * offset - 1);
		room.ball.direction.x *= -1;
		room.ball.direction.y = Math.sin(angle);
		if (room.ball.speed != PongConstants.SPEED_BALL_POWERUP)
			room.ball.speed = Math.min(room.ball.speed += 0.5, PongConstants.MAX_BALL_SPEED);
		if (playerHit === 0){
			room.ball.position.x = room.players[0].racket.pos.x + room.players[0].racket.width + room.ball.radius + 2;
		}
		else {
			room.ball.position.x = room.players[1].racket.pos.x - room.ball.radius - 2;
		}
	}

	hasRacketIntersect(ball: Ball, racket: Racket): Boolean{
		const distX = Math.abs(ball.position.x - racket.pos.x - racket.width / 2);
		const distY = Math.abs(ball.position.y - racket.pos.y - racket.size / 2);
		if (distX > (racket.width / 2 + ball.radius))
			return (false);
		if (distY > (racket.size / 2 + ball.radius))
			return (false);
		if (distX <= (racket.width / 2))
			return (true);
		if (distY <= (racket.size / 2))
			return (true);
		const dx = distX - racket.width / 2;
		const dy = distY - racket.size / 2;
		return (dx * dx + dy * dy <= ball.radius * ball.radius);
	}

	hasPowerupIntersect(ball: Ball, powerup: Powerup): Boolean{
		const distX = Math.abs(ball.position.x - powerup.pos.x - powerup.radius / 2);
		const distY = Math.abs(ball.position.y - powerup.pos.y - powerup.radius / 2);
		if (distX > (powerup.radius / 2 + ball.radius))
			return (false);
		if (distY > (powerup.radius / 2 + ball.radius))
			return (false);
		if (distX <= (powerup.radius / 2))
			return (true);
		if (distY <= (powerup.radius / 2))
			return (true);
		const dx = distX - powerup.radius / 2;
		const dy = distY - powerup.radius / 2;
		return (dx * dx + dy * dy <= ball.radius * ball.radius);
	}

	updateBall(room: Room) {
		const next = {
			x: room.ball.direction.x * room.ball.speed + room.ball.radius,
			y: room.ball.direction.y * room.ball.speed + room.ball.radius,
		}
		let indexPlayer = -1;
		if (room.ball.position.x + next.x > room.canvas.width)
			indexPlayer = 0;
		else if (room.ball.position.x + next.x < room.ball.radius)
			indexPlayer = 1;

		if (indexPlayer != -1){
			room.players[indexPlayer].score++;
			if (room.mode === Mode.RANKED && room.players[indexPlayer].score === PongConstants.WIN_SCORE_VALUE) {
				this.roomService.emitToPlayers(room, "updateScore", room.players[0].score, room.players[1].score);
				room.state = State.ENDGAME;
				return;
			}
			this.resetBall(room);
			this.resetRacket(room);
			room.state = State.COOLDOWN;
			return;
		}
		
		if (room.ball.position.y + next.y >= room.canvas.height
			|| room.ball.position.y + next.y <= room.ball.radius * 2) {
				room.ball.direction.y *= -1;
		}
			
		if (this.hasRacketIntersect(room.ball, room.players[0].racket))
			this.racketBallCollision(room, room.players[0].racket, 0);

		else if (this.hasRacketIntersect(room.ball, room.players[1].racket))
			this.racketBallCollision(room, room.players[1].racket, 1);

		else {
			room.ball.position.x += room.ball.direction.x * room.ball.speed;
			room.ball.position.y += room.ball.direction.y * room.ball.speed;
		}
	}

	activatePowerup(powerup: Powerup, room: Room){
		powerup.activatedBy = Number(room.ball.direction.x < 0);
		let racket: Racket = room.players[powerup.activatedBy].racket;
		room.players[powerup.activatedBy].user.stats.totalPowerups += 1;
		this.userService.saveUser(room.players[powerup.activatedBy].user);
		switch (powerup.effect) {
			case Effect.BIG_PADDLE: {
				racket.pos.y -= PongConstants.BIG_PAD_VALUE;
				racket.size += PongConstants.BIG_PAD_VALUE * 2;
				racket.effectTimeout = setTimeout(() => {
					racket.size = PongConstants.RACKET_HEIGHT;
				}, PongConstants.BIG_PADDLE_DURATION)
			}
			break;
			case Effect.LIL_PADDLE: {
				racket = room.players[Number(!Boolean(powerup.activatedBy))].racket;
				racket.pos.y += PongConstants.LIL_PAD_VALUE;
				racket.size -= PongConstants.LIL_PAD_VALUE * 2;
				racket.effectTimeout = setTimeout(() => {
					racket.size = PongConstants.RACKET_HEIGHT;
				}, PongConstants.LIL_PADDLE_DURATION)
			}
			break;
			case Effect.SPEEDY_BALL: {
				const oldSpeed = room.ball.speed;
				room.ball.speed = PongConstants.SPEED_BALL_POWERUP;
				setTimeout(() => {
					if (room.ball.speed === PongConstants.SPEED_BALL_POWERUP)
						room.ball.speed = oldSpeed;
				}, PongConstants.SPEEDY_BALL_DURATION)
			}
			break;
		}
	}

	powerupsHandling(room: Room){
		for (let i = 0; i < room.powerups.length; i++){
			if (this.hasPowerupIntersect(room.ball, room.powerups[i])){
				this.activatePowerup(room.powerups[i], room);
				room.powerups.splice(i, 1);
			}
		}
	}

	updateGame(client: Socket, room: Room) {
		this.updateBall(room);
		this.updateRacket(client, room, client.data.keyUp, client.data.keyDown);
		this.powerupsHandling(room);
		const {["effectTimeout"]: timeOut1, ...racket1} = room.players[0].racket;
		const {["effectTimeout"]: timeOut2, ...racket2} = room.players[1].racket;
		client.emit("updateGame", room.ball, racket1, racket2, room.powerups);
	}

	async initGame(room: Room) {
		if (!room.ball){
			room.ball = new Ball();
			this.resetBall(room);
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
			this.resetRacket(room);
		room.canvas.width = PongConstants.CANVAS_WIDTH;
		room.canvas.height = PongConstants.CANVAS_HEIGHT;
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
		if (room.mode !== Mode.RANKED){
			room.timerTimeout = setTimeout(() => {
				room.state = State.ENDGAME;
				clearInterval(room.timerInterval);
			}, (PongConstants.GAME_DURATION - room.time) * 1000);
		}

	}

	randInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	generatePowerup(room: Room): Powerup{
		const possibilities = [{name:"Grande Raquette", color: "#1A2E61", effect: Effect.BIG_PADDLE},
								{name:"Petite Raquette", color: "#B38ED3", effect: Effect.LIL_PADDLE}, 
								{name:"Balle Rapide", color: "#F44E1A", effect: Effect.SPEEDY_BALL}];
		const choice = possibilities[this.randInt(0, 2)];
		const res: Powerup = {
			name: choice.name,
			effect: choice.effect,
			activatedBy: -1,
			pos: {x: this.randInt(400, room.canvas.width - 400),
				y: this.randInt(200, room.canvas.height - 200)},
			radius: 64,
			color: choice.color,
		}
		return (res);
	}

	async powerupsInit(room: Room) {
		if (room.mode != Mode.ARCADE)
			return;
		const it = setInterval(() => {
			if (room.state === State.FINAL)
				clearInterval(it);
			if (room.time % 15 === 7){
				room.powerups.push(this.generatePowerup(room));
			}
		}, 1000)
	}

}