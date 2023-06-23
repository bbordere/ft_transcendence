import { User } from "src/user/user.entity";
import { Channel } from "./channel.entity";
import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Message {
	@PrimaryColumn()
	@Generated('increment')
	public id: number;

	@ManyToOne(() => Channel, {
		nullable: false,
	})
	@JoinColumn({ name: 'channel' })
	public channel: Channel;

	@Column()
	public text: string;

	@ManyToOne(() => User, {
		nullable: false,
	})
	@JoinColumn({ name: 'sender' })
	public sender: User;
}