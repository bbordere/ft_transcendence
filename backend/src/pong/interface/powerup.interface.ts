import { Coords } from "./room.interface";

export class Powerup {
	name: string;
	effect: Effect;
	activatedBy: number;
	pos: Coords;
	radius: number = 20;
	color: string;
}

export enum Effect {
	BIG_PADDLE,
	LIL_PADDLE,
	SPEEDY_BALL
}