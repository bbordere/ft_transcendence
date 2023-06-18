import { Body, Controller, Get, Param, Post, Req, Res, UseGuards,} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}


	//TODO SEND PARTIAL USER TO NOT SEND CRITICAL VALUES

	@Get()
	getUsers(){
		return (this.userService.getAllUsers());
	}
	
	@Get('/me')
	@UseGuards(JwtAuthGuard)
	me(@Req() req){
		const id = req["user"]["user"]["id"];
		return (this.userService.getById(id));
	}
	
	@Get(":name")
	getUserByName(@Param('name') name: string){
		return (this.userService.getByName(name));
	}
	
	@Post('/setname')
	@UseGuards(JwtAuthGuard)
	async setUsername(@Req() req, @Body() body, @Res() res: Response){
		if (! await this.userService.updateUsername(req["user"]["user"]["email"], body["username"]))
			res.statusCode = 403;
		else
			res.statusCode = 201;
		res.send();
	}

	@Get("/id/:id")
	getUserById(@Param('id') id: number){
		return (this.userService.getById(id));
	}

	@Post('/:userId/channels/:channelId/add')
	async addUserToChannel(@Param('userId') userId: number, @Param('channelId') channelId: number) {
		await this.userService.addUserToChannel(userId, channelId);
		return {
			message: 'user added',
		};
	}

	@Post('/:userId/channels/:channelId/remove')
	async removeUserFromChannel(@Param('userId') userId: number, @Param('channelId') channelId: number) {
		await this.userService.removeUserFromChannel(userId, channelId);
	}

	@Get('/:userId/joinedChannels')
	async getJoinedChannels(@Param('userId') userId: number) {
		return (this.userService.getJoinedChannels(userId));
	}
}
