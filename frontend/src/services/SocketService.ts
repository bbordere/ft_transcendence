import { io, type Socket } from "socket.io-client";

export class SocketService {
	private static socket: Socket;
	private static isUp: boolean = false;

	static get getInstance(){
		return (this.socket);
	}

	static setSocket(url: string, args: any){
		SocketService.socket = io(url, args);
		this.isUp = true;
	}

	static get getStatus(){
		return (this.isUp);
	}
}