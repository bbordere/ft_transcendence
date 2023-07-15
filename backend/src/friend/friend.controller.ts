import { Controller, Post, Body, Delete } from '@nestjs/common';
import { FriendService } from './friend.service';
import { friendDto } from './dtos/friend.dto';

@Controller('friend')
export class FriendController {
	constructor(private friendService: FriendService) {}

	@Post('/add')
	async addFriend(@Body() friendDto: friendDto) {
		console.log(friendDto.username);
		console.log(friendDto.sender);
		return this.friendService.addFriend(friendDto.username, friendDto.sender);
	}
	//COUCOU BASTIEN TU ES LE PLUS BEAU ET LE PLUS GENTIL DES COPAINS TU VEUX SORTIR AVEC MOI
	@Delete('/delete')
	async deleteFriend(@Body('username') name: string) {
		return this.friendService.deleteFriend(name);
	}
}
