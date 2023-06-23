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
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'channel' })
	public channel: Channel;

	@Column()
	public text: string;

	@ManyToOne(() => User, {
		nullable: false,
		cascade: true,
		eager: true,
	})
	@JoinColumn({ name: 'sender' })
	public sender: User;
}