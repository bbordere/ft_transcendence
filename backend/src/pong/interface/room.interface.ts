import { Player } from "./player.interface";

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
	direction:	Coords;
	speed:		number;
	radius:		number;
}

export class Canvas {
	width: number;
	height: number;
}


export enum State {
	QUEUE = 0,
	INIT,
	COOLDOWN,
	PLAY,
	RESET,
	WAITING,
	ENDGAME,
	FINAL
}

export enum Mode {
	standard = 0,
	arcade,
	ranked
}

export class Room {
	id: number;
	state: State;
	mode: Mode;
	players: Array<Player>;
	ball: Ball = undefined;
	time: number;
	timerIntervcal: NodeJS.Timeout;
	canvas: Canvas
}