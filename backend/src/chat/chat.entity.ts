import { Column, Entity, Generated, PrimaryColumn } from "typeorm";

@Entity()
export class Message {
	@PrimaryColumn()
	@Generated('increment')
	public id: number;

	@Column()
	public text: string;

	@Column()
	public sender: number;
};

@Entity()
export class Channel {
	@PrimaryColumn()
	@Generated('increment')
	public id: number;

	@Column({ unique: true })
	public name: string;

	@Column()
	public messages: Message[];

	@Column()
	public users: number[];
};