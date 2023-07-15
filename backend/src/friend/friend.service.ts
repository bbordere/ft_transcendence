import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from './friend.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class FriendService {
	constructor (
		@InjectRepository(Friend)
		private friendRepository: Repository<Friend>,
		private userService: UserService,
	) {}

	async addFriend(username: string, sender: number): Promise<Friend | null> {
		// console.log(username);
		// console.log(sender);
		return null;
	}

	async deleteFriend(name: string): Promise<void> {
		const userIdAdd = (await this.userService.getByName(name)).id;
		await this.friendRepository.delete(userIdAdd);
	}

	async getFriendId(FriendId: number): Promise<Friend | null> {
		return null;
	}
}
