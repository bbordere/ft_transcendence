import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from './friend.entity';
import { UserService } from '../user/user.service';

export interface friendTab {
	userId: number;
	status: string;
}

@Injectable()
export class FriendService {
	
	constructor(
		@InjectRepository(Friend)
		private friendRepository: Repository<Friend>,
		private userService: UserService,
	) { }

	async addFriend(username: string, sender: number): Promise<string> {
		const friendToAdd = await this.userService.getByName(username);
		if (!friendToAdd)
			return ("Ce nom d'utilisateur n'existe pas !");
		else if (friendToAdd.id === sender)
			return ("Tu ne peux pas t'ajouter en ami !");
		else if (await this.getFriendId(friendToAdd.id, sender))
			return ("Cet utilisateur est dans ta liste d'amis !");
		const friend = new Friend();
		friend.UserId = sender;
		friend.FriendId = friendToAdd.id;
		friend.Status = 'pending';
		this.friendRepository.save(friend);
		return ('');
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

	async getFriendsFromUser(userId: number): Promise<number[]> {
		const friendships = await this.friendRepository.find({
			where: [
				{ UserId: userId },
				{ FriendId: userId },
			]
		});
		const friends = [];
		for (let friendship of friendships) {
			if (friendship.UserId === userId)
				friends.push(friendship.FriendId);
			else
				friends.push(friendship.UserId);
		}
		return (friends);
	}

	async getFriend(id: number) {
		const friendships = await this.friendRepository.find({
			where: [
				{ UserId: id },
				{ FriendId: id },
			]
		});
		const friends: friendTab[] = [];

		for (let friendship of friendships) {
			const friend: friendTab = {
				userId: friendship.UserId === id ? friendship.FriendId : friendship.UserId,
				status: friendship.Status,
			};
			friends.push(friend);
		}
		return (friends);
	}
}