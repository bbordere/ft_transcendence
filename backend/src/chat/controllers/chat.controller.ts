import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { ChatService } from "../chat.service";
import { User } from "src/user/user.entity";

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get('/list')
	getChannels() {
		return (this.chatService.getAll());
	}

	@Get('/:name')
	async getByName(@Param('name') name: any) {
		let channel = null;
		try {
			channel = await this.chatService.getById(name);
			if (!channel)
				throw new Error("Not an ID");
		}
		catch {
			if (Array.from(name)[0] != '#')
					name = '#' + name;
				channel = await this.chatService.getByName(name);
		}
		return (channel);
	}

	@Post('/create')
	async create(@Body('name') name: string, @Body('password') password: string, @Body('creator') creator: User) {
		if (Array.from(name)[0] != '#')
			name = '#' + name;
		let channel;
		try {channel = await this.chatService.create(name, password, (password !== ''), creator);}
		catch {return (null);}
		return {
			message: 'channel created',
			channel
		};
	}

	@Post('/delete')
	async delete(@Body('name') name: string) {
		if (Array.from(name)[0] != '#')
			name = '#' + name;
		this.chatService.delete(name);
	}

	@Get('/:id/admin')
	async getAdmin(@Param('id') id: number) {
		return (await this.chatService.getChannelAdmin(id));
	}

	@Get('/:id/getUsers')
	async getUsersInChannel(@Param('id') id: number) {
		return (await this.chatService.getUsersInChannel(id));
	}
}