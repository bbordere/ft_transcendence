import { Coords } from "./room.interface";

export class Powerup {
	name: string;
	activatedBy: number;
	pos: Coords;
	radius: number = 20;
	color: string;
}