import { Player } from "./player.interface";
import { Socket } from "socket.io";

export class Coords {
	x:	number;
	y:	number;
}

export class Ball {
	constructor(){
		this.position = {x: 300, y: 300};
		this.speed = 1;
		this.direction  = {x: 1, y: 1};
	}

	position:	Coords;
	speed:		number;
	direction:	Coords;
}

export enum State {
	QUEUE = 0,
	INIT,
	COOLDOWN,
	PLAY,
	RESET,
	ENDGAME
}

export enum Mode {
	standard = 0,
	arcade,
	ranked
}

export class Room {
	socket: Socket;
	state: State;
	mode: Mode;
	players: Array<Player>;
	ball: Ball;
	time: number;
}