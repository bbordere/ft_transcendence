import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { sendMessageDto } from "./dto/send-message.dto";

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get()
	chatPage(): string {
		return (this.chatService.chatPage());
	}

	@Post()
	send(@Body() sendMessageDto: sendMessageDto) {
		//Default sender is the logged in user
		//Receiver is a string (username)
		// - it should be valid !!
		
		return {
			sender: sendMessageDto.sender,
			receiver: sendMessageDto.receiver,
			message: sendMessageDto.message,
		};
	}
}