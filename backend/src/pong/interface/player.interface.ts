import { Coords } from "./room.interface";
import { Room } from "./room.interface";
import { Socket } from 'socket.io';

export interface Player {
	socket: Socket;
	position: Coords;
	score: number;
	user: any;
	room: Room;
}