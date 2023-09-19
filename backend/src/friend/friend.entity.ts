import { Column, Entity, Generated, PrimaryColumn } from "typeorm";
import { State } from "src/user/user.entity";

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

	// @Column({default: State.OFFLINE})
	// public State: State;
};