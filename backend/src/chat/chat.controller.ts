import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { ChatService } from "./chat.service";

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
	async create(@Body('name') name: string) {
		if (Array.from(name)[0] != '#')
			name = '#' + name;
		const channel = await this.chatService.create(name);
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
}