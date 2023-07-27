
import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumnCannotBeNullableError, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./channel.entity";

@Entity()
export class ChannelPerms {
	@PrimaryGeneratedColumn()
	public id: number;

	@ManyToOne(() => User, user => user.perms)
	@JoinColumn({ name: 'user_id' })
	public user: User;

	@ManyToOne(() => Channel, channel => channel.perms)
	@JoinColumn({ name: 'channel_id' })
	channel: Channel;

	@Column()
	public role: ChannelPerms.Role;
}

export namespace ChannelPerms {
	export enum Role {
		USER,
		CREATOR,
	}
}