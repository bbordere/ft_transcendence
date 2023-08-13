import { Inject, Injectable } from "@nestjs/common";
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
		channel.admin = creator
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

	async getChannelAdmin(channelId: number): Promise<User | null> {
		const channel = await this.channelRepository.findOne({where: {id: channelId}, relations: ['admin']});
		if (!channel)
			return (null);
		return (channel.admin);
	}
}
