import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from './friend.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class FriendService {
	
	constructor(
		@InjectRepository(Friend)
		private friendRepository: Repository<Friend>,
		private userService: UserService,
	) { }

	async addFriend(username: string, sender: number): Promise<Friend | string> {
		const friendToAdd = await this.userService.getByName(username);
		if (!friendToAdd) return "Ce nom d'utilisateur n'existe pas !";
		else if (friendToAdd.id === sender)
			return "Tu ne peux pas t'ajouer en ami !";
		else if (await this.getFriendId(friendToAdd.id, sender))
			return "Cet utilisateur est dans ta liste d'amis";
		const friend = new Friend();
		friend.UserId = sender;
		friend.FriendId = friendToAdd.id;
		friend.Status = 'pending';
		return this.friendRepository.save(friend);
	}

	async deleteFriend(id1: number, id2: number): Promise<void> {
		await this.friendRepository.delete({ UserId: id1, FriendId: id2 });
		await this.friendRepository.delete({ UserId: id2, FriendId: id1 });
	}

	async acceptFriend(id1: number, id2: number): Promise<void> {
		const user = await this.friendRepository.findOne({
			where: [
				{ UserId: id1, FriendId: id2 },
				{ UserId: id2, FriendId: id1 },
			],
		});
		user.Status = 'accepted';
		await this.friendRepository.save(user);
	}

	async getFriendId(
		FriendToAdd: number,
		sender: number,
	): Promise<Friend | null> {
		return await this.friendRepository.findOne({
			where: [
				{ UserId: sender, FriendId: FriendToAdd },
				{ UserId: FriendToAdd, FriendId: sender },
			],
		});
	}

	async friendlist(userId: number): Promise<Friend[]> {
		const friends = this.friendRepository.find({
			where: [
				{ UserId: userId },
				{ FriendId: userId },
			]
		});
		return (friends)
	}
}
