import { Injectable } from "@nestjs/common";
import { Channel } from "./chat.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Channel)
		private channelsRepo: Repository<Channel>,
	) {}

	getAll(): Promise<Channel[]> {
		return (this.channelsRepo.find());
	}

	getById(id: number): Promise<Channel | null> {
		return (this.channelsRepo.findOneBy({ id }));
	}

	getByName(name: string): Promise<Channel | null> {
		return (this.channelsRepo.findOneBy({ name }));
	}

	async create(name: string): Promise<Channel | null> {
		if (await this.getByName(name) !== null)
			return (null);
		const channel = new Channel();
		channel.name = name;
		return (this.channelsRepo.save(channel));
	}

	async delete(name: string) {
		let rm = await this.getByName(name);
		if (rm == null)
			return ;
		this.channelsRepo.delete({ id: rm.id });
	}
}
