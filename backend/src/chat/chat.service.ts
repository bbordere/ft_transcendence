import { Injectable } from "@nestjs/common";

@Injectable()
export class ChatService {
	chatPage(): string {
		return ('<form method="post">\
		<label for="username">Choose a user</label>\
		<input type="text" name="username" id="username" placeholder="Username">\
		<label for="message">Message</label>\
		<input type="text" name="message" id="msg" placeholder="write a message...">\
		<button type="submit">Send</button>\
	</form>')
	}
}