import { Controller, Param, Get, Req } from "@nestjs/common";
import { ChatService } from "../chat.service";
import { Message } from "../entities/message.entity";
import { AuthService } from "src/auth/auth.service";

@Controller('message')
export class MessageController {
	constructor(
		private readonly chatService: ChatService,
		private readonly authService: AuthService,
	) {}

	@Get(":channelId/list")
	async getMessages(@Param('channelId') channelId: number, @Req() request: Request): Promise<Message[] | null> {
		const user = await this.authService.getUserFromToken(request['cookies']['access_token']);
		return (this.chatService.getChannelMessages(user.id, channelId));
	}
}