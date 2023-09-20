import { Inject, Injectable, UseInterceptors } from "@nestjs/common";
import { Channel } from "./entities/channel.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "./entities/message.entity";
import { User } from "src/user/user.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>,
		@InjectRepository(Message)
		private messageRepository: Repository<Message>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	getAll(): Promise<Channel[]> {
		return (this.channelRepository.find());
	}

	getById(id: number): Promise<Channel | null> {
		return (this.channelRepository.findOneBy({ id }));
	}

	getByName(name: string): Promise<Channel | null> {
		return (this.channelRepository.findOneBy({ name }));
	}

	async create(name: string, password: string, protect: boolean, creator: User): Promise<Channel | null> {
		if (name.match('/^\s*$/'))
			throw new Error('wrong name format.');
		if (await this.getByName(name) !== null)
			return (null);
		const channel = new Channel();
		channel.name = name;
		channel.password = (protect ? await bcrypt.hash(password, 8) : '');
		channel.protected = protect;
		channel.owner = creator
		const createdChannel = await this.channelRepository.save(channel);
		return (createdChannel);
	}

	async delete(name: string) {
		let rm = await this.getByName(name);
		if (rm == null)
			return ;
		this.channelRepository.delete({ id: rm.id });
	}

	async addMessageToChannel(msg: {channelId: number, text: string, sender: number}) {
		const {channelId, text, sender} = msg;
		const channel = await this.channelRepository.findOne({where: {id: channelId}, relations: ['messages']});
		if (!channel)
			return (null);
		const senderUser = await this.userRepository.createQueryBuilder('user')
			.leftJoinAndSelect('user.channels', 'channels')
			.where('user.id = ' + sender)
			.andWhere('channels.id = ' + channelId)
			.getOne();
		if (!senderUser)
			return (null);
		const message = new Message();
		message.text = text;
		message.channel = channel;
		message.sender = senderUser;
		const savedMessage = await this.messageRepository.save(message);
		channel.messages.push(savedMessage);
		await this.channelRepository.save(channel);
		return (savedMessage);
	}

	async getChannelMessages(channelId: number): Promise<Message[] | null> {
		const channel = await this.channelRepository.findOne({where: {id: channelId}, relations: ['messages']});
		if (!channel)
			return (null);
		return (channel.messages);
	}

	async getChannelOwner(channelId: number): Promise<User | null> {
		const channel = await this.channelRepository.findOne({where: {id: channelId}, relations: ['owner']});
		if (!channel)
			return (null);
		return (channel.owner);
	}

	async getUsersInChannel(channelId: number): Promise<User[] | null> {
		const channel = await this.channelRepository.findOne({where: {id: channelId}});
		if (!channel)
			return (null);
		const users = await this.userRepository.createQueryBuilder('user')
		.leftJoinAndSelect('user.channels', 'channel')
		.where('channel.id = ' + channel.id)
		.getMany();
		if (!users)
			return (null);
		return (users);
	}

	async addAdminInChannel(channelId: number, userId: number): Promise<Channel> {
		const channel = await this.channelRepository.findOne({where: {id: channelId}, relations: ['admins', 'owner', 'bannedUsers']});
		const user = await this.userRepository.findOne({where: {id: userId}});

		if (!channel)
			throw new Error("Could not find channel.");
		if (!user)
			throw new Error("Could not find user.");
		if (user.id === channel.owner.id)
			throw new Error("The user is the owner of the channel.");
		if (channel.bannedUsers.includes(user))
			throw new Error("This user has been banned from this channel");
		channel.admins.push(user);
		return (await this.channelRepository.save(channel));
	}

	async removeAdminInChannel(channelId: number, userId: number): Promise<Channel> {
		const channel = await this.channelRepository.findOne({where: {id: channelId}, relations: ['admins', 'owner', 'bannedUsers']});
		const user = await this.userRepository.findOne({where: {id: userId}});

		if (!channel)
			throw new Error("Could not find channel.");
		if (!user)
			throw new Error("Could not find user.");
		if (channel.admins.includes(user))
			throw new Error("User is banned.");
		channel.admins.splice(channel.admins.indexOf(user), 1);
		return (await this.channelRepository.save(channel));
	}
}
