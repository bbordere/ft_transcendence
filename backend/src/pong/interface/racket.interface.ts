import { Coords } from "./room.interface";

export class Racket {
	constructor(){
		this.pos = {x: 0, y: 0};
		this.size = 0;
		this.width = 0;
	}
	pos: Coords;
	size: number;
	width: number;
}