import { Coords } from "./room.interface";
import { Socket } from 'socket.io';

export interface Player {
	socket: Socket;
	score: number;
	user: any;
	roomId: number;
	racket: Racket;
	// room: Room;
}

export class Racket {
	constructor(){
		this.top_pos = {x: 0, y: 0};
		this.bot_pos = {x: 0, y: 0};
		this.size = 0;
		this.width = 0;
	}
	top_pos: Coords;
	bot_pos: Coords;
	size: Number;
	width: Number;
}