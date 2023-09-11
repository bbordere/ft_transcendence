import { Column, Entity, Generated, PrimaryColumn, JoinColumn, ManyToOne } from "typeorm";
import { User} from "src/user/user.entity"

@Entity()
export class Friend {
	@PrimaryColumn()
	@Generated('increment')
	public id: number;

	@Column()
	public UserId: number;

	@Column()
	public FriendId: number;

	@Column()
	public Status: number;

};