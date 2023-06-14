import { Controller, Get, Post, Body } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get('/list')
	getChannels() {
		return (this.chatService.getAll());
	}

	@Post('/create')
	async create(@Body('name') name: string) {
		const channel = await this.chatService.create(name);
		return {
			message: 'channel created',
			channel
		};
	}
}