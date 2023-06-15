import { Player } from "./player.interface";
import { Socket } from "socket.io";

export interface Coords {
	x:	number;
	y:	number;
}

export interface Ball {
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

enum Mode {
	standar = 0,
	arcade,
	ranked
}

export interface Room {
	socket: Socket;
	state: State;
	mode: Mode;
	players: Array<Player>;
	ball: Ball;
	time: number;
}