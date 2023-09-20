import { Column, Entity, Generated, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";
import { Channel } from "src/chat/entities/channel.entity";

@Entity()
export class Friend {
	@PrimaryColumn()
	@Generated('increment')
	public id: number;

	@Column()
	public UserId: number;

	@Column()
	public FriendId: number;

	@Column( { default: 'pending'})
	public Status: string;

	@OneToOne(() => Channel, {eager: true})
	@JoinColumn()
	channel: Channel;
};