import { User } from "src/user/user.entity";
import { Column, Entity, Generated, ManyToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Channel {
	@PrimaryColumn()
	@Generated('increment')
	public id: number;

	@Column({ unique: true })
	public name: string;

	@ManyToMany(() => User, user => user.channels)
	users: User[];
};