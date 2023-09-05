import { Body, Controller, Get, Param, Post, Req, Res, UseGuards,} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}


	//TODO SEND PARTIAL USER TO NOT SEND CRITICAL VALUES

	@Get()
	async getUsers(){
		return (this.userService.getAllUsers());
	}
	
	@Get('/me')
	@UseGuards(JwtAuthGuard)
	async me(@Req() req: Request){
		const id = req["user"]["user"]["id"];
		const user = await this.userService.getById(id);
		return (this.userService.getPartialUser(user));
	}
	
	@Get(":name")
	async getUserByName(@Param('name') name: string){
		const user = await this.userService.getByName(name)
		if (!user)
			return (null);
		return (this.userService.getPartialUser(user));
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
	async getUserById(@Param('id') id: number){
		const user = await this.userService.getById(id);
		return (this.userService.getPartialUser(user));
	}

	@Post('/:userId/channels/:channelId/add')
	async addUserToChannel(@Param('userId') userId: number, @Param('channelId') channelId: number, @Body('password') password: string) {
		try {await this.userService.addUserToChannel(userId, channelId, password);}
		catch {
			return {
				ok: false,
				message: 'user not added'
			};
		}
		return {
			ok: true,
			message: 'user added',
		};
	}

	@Post('/:userId/channels/:channelId/remove')
	async removeUserFromChannel(@Param('userId') userId: number, @Param('channelId') channelId: number) {
		await this.userService.removeUserFromChannel(userId, channelId);
		return {
			message: 'user sucessfully removed from channel',
			ok: true,
		};
	}

	@Post('/:userId/channels/:channelId/ban')
	async banUserFromChannel(@Param('userId') userId: number, @Param('channelId') channelId: number) {
		this.userService.banUserFromChannel(userId, channelId);
	}

	@Post('/:userId/channels/:channelId/unban')
	async UnbanUserFromChannel(@Param('userId') userId: number, @Param('channelId') channelId: number) {
		this.userService.UnbanUserFromChannel(userId, channelId);
	}


	@Get('/:userId/joinedChannels')
	async getJoinedChannels(@Param('userId') userId: number) {
		return (this.userService.getJoinedChannels(userId));
	}
}
