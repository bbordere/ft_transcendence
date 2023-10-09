import { Injectable, } from '@nestjs/common';
import { PongGame } from './pong.service';
import { RoomService } from './room.service';
import { Mode, Room, State } from './interface/room.interface';
import { Socket } from 'socket.io';
import { PongConstants } from './interface/constants.interface';
import { Powerup } from './interface/powerup.interface';


@Injectable()
export class GameService {
	constructor(private readonly pongGame: PongGame, private readonly roomService: RoomService) {
		setInterval(() => {
			this.roomService.checkRoomLoop(this);
		}, 200);
	};


	checkRoom(room: Room) {
		let countDown: number = 0;
		let isStarted: boolean = false;
		const it = setInterval(async () => {
			if (!isStarted && room.players.length === 2) {
				isStarted = true;
				await this.playGame(room);
			}
			switch (room.state) {
				case State.WAITING: {
					if (room.timerInterval) {
						clearInterval(room.timerInterval);
						clearTimeout(room.timerTimeout);
						room.timerInterval = null;
					}

					this.roomService.emitToPlayers(room, 'text', 'WAITING');
					countDown++;
					if (!this.roomService.haveUserDisco(room.id)) {
						room.state = State.INIT;
						countDown = 0;
					}
					if (countDown > (1000 / PongConstants.GAME_TICK) * 5) {
						room.state = State.ENDGAME;
					}
				}
					break;

				case State.ENDGAME: {

					// if (countDown < (1000 / PongConstants.GAME_TICK) * 5 && !this.roomService.haveUserDisco(room.id))
					// 	countDown++
					// else
					await this.roomService.endGame(room);
				}
					break;

				case State.FINAL: {
					countDown = 0;
					this.roomService.finalGame(room);
					clearInterval(it);
				}
					break;

				case State.PLAY: {
					countDown = 0;
				}
					break;

				case State.QUEUE: {
					this.roomService.emitToPlayers(room, 'text', "QUEUEING");
				}
					break;

				default:
					break;
			}
		}, PongConstants.GAME_TICK);
	}

	async keyHandling(client: Socket) {
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
			client.data.keyDown = keyDown;
			client.data.keyUp = keyUp;
		});
	}

	isPromise(obj: any){
		return (Object(obj).constructor === Promise);
	}

	async playGame(room: Room) {
		await this.pongGame.initGame(room);
		await this.pongGame.startTimer(room);
		await this.pongGame.powerupsInit(room);
		let cooldown: number = 0;
		let needUpdate = true;
		this.roomService.emitToPlayers(room, "ids", room.players[0].user.id, room.players[1].user.id)
		room.gameInterval = setInterval(() => {
			switch (room.state) {
				case State.INIT: {
					this.roomService.emitToPlayers(room, 'time', this.pongGame.formatTime(room.time, room.mode));
					room.state = State.COOLDOWN;
				}
					break;

				case State.COOLDOWN: {
					room.powerups = [] as Powerup[];
					this.pongGame.updateGame(room.players[0].socket, room, false);
					this.pongGame.updateGame(room.players[1].socket, room, false);

					if (needUpdate) {
						needUpdate = false;
						this.pongGame.resetBall(room);
						this.pongGame.updateGame(room.players[0].socket, room, false);
						this.pongGame.updateGame(room.players[1].socket, room, false);
						this.roomService.emitToPlayers(room, "updateScore", room.players[0].score, room.players[1].score);
					}
					if (room.timerInterval) {
						clearInterval(room.timerInterval);
						clearTimeout(room.timerTimeout);
					}
					if (cooldown < (1000 / PongConstants.GAME_TICK) * 2)
						cooldown++;
					else {
						cooldown = 0;
						room.state = State.PLAY;
						this.pongGame.startTimer(room);
						needUpdate = true;
					}
				}
					break;

				case State.ENDGAME: {
					clearInterval(room.gameInterval);
					clearInterval(room.timerInterval);
					this.roomService.emitToPlayers(room, 'text', "ENDGAME");
				}
					break;

				case State.PLAY: {
					cooldown = 0;
					this.pongGame.updateGame(room.players[0].socket, room);
					this.pongGame.updateGame(room.players[1].socket, room);
					if (room.mode === Mode.RANKED && (room.players[0].score === PongConstants.WIN_SCORE_VALUE || room.players[1].score === PongConstants.WIN_SCORE_VALUE)) {
						this.roomService.emitToPlayers(room, "updateScore", room.players[0].score, room.players[1].score);
						room.state = State.ENDGAME;
					}
				}
					break;

			}
		}, PongConstants.GAME_TICK);
	}

}