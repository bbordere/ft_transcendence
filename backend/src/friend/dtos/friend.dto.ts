import { IsNotEmpty } from 'class-validator';

export class friendDto {
	constructor(body){
		this.username = body["username"];
		this.sender = body["sender"];
	}

	@IsNotEmpty()
	username: string;

	sender: number;
}