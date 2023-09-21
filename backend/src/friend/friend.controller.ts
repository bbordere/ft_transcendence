import { Controller, Post, Body, Delete, Get, Query, Patch, Param } from '@nestjs/common';
import { FriendService } from './friend.service';
import { friendDto } from './dtos/friend.dto';
import { Friend } from './friend.entity';

@Controller('friend')
export class FriendController {
	constructor(private friendService: FriendService) {}

	@Post('/add')
	async addFriend(@Body() friendDto: friendDto) {
		const ret = await this.friendService.addFriend(friendDto.username, friendDto.sender);
		ret instanceof Friend ? console.log("OUI") : console.log(ret);
	}

	@Patch('/accept')
	async acceptFriend(@Query('id1') id1: number, @Query('id2') id2: number) {
		return this.friendService.acceptFriend(id1, id2);
	}

	@Delete('/delete')
	async deleteFriend(@Query('id1') id1: number, @Query('id2') id2: number) {
		return this.friendService.deleteFriend(id1, id2);
	}

	@Get('/:id/list')
	async friendlist(@Param('id') id: number): Promise<Friend[]> {
		return this.friendService.friendlist(id);
	}
}
