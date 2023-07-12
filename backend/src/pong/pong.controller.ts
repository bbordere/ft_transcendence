import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PongGame } from './pong.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/user.entity';
import { Room } from './interface/room.interface';

@Controller('pong')
export class PongController {
	constructor(private pongService: PongGame) {}
	
	@Get()
	async getAllRooms(){
		return await this.pongService.getRooms();
	}

	@Get('/status')
	@UseGuards(JwtAuthGuard)
	async getStatus(@Req() req){
		const user: User = req["user"]["user"];
		const statusObject = await this.pongService.hasDisconnect(user["email"]);
		const room: Room = await this.pongService.getRoomById(statusObject["roomId"]);
		if (room)
			return {disconnect: statusObject["status"], mode: room.mode};
		else
			return {disconnect: false, mode: -1};
	}
}
