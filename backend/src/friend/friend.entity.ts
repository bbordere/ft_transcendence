import { Column, Entity, Generated, PrimaryColumn } from "typeorm";

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

};