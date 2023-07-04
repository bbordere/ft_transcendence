import { Controller, Param, Get } from "@nestjs/common";
import { ChatService } from "../chat.service";
import { Message } from "../entities/message.entity";

@Controller('message')
export class MessageController {
	constructor(
		private readonly chatService: ChatService,
	) {}

	@Get(":channelId/list")
	async getMessages(@Param('channelId') channelId: number): Promise<Message[] | null> {
		return (this.chatService.getChannelMessages(channelId));
	}
}