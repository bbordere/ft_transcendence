import { Controller, Get } from '@nestjs/common';
import { PongGame } from './pong.service';

@Controller('pong')
export class PongController {
	constructor(private pongService: PongGame) {}
	
	@Get()
	async getAllRooms(){
		return await this.pongService.getRooms();
	}
}
