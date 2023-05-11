import { Column, Entity, PrimaryColumn, Generated, BeforeInsert } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity()
export class User{
	@PrimaryColumn()
	@Generated('increment')
	public id: number;

	@Column({ unique: true })
	public name: string;

	@Column()
	private password: string;

	@Column({ default: true})
	public isOnline: boolean

	@Column({ default: false})
	public auth2f: boolean

	@Column("text", { array: true , nullable: true})
	public friends: Array<any>

	@Column({ default: ""})
	public pictureLink: string

	@Column({ default: -1})
	public rank: number

	@Column({ default: 0})
	public matchPlayed: number

	@Column({ default: 0})
	public matchWin: number

	@Column("text", { array: true , nullable: true})
	public matchHistory: Array<any>

	@BeforeInsert()
	async hashPassword() {
	  this.password = await bcrypt.hash(this.password, 8);
	}

	async validatePassword(password: string): Promise<boolean> {
		return await bcrypt.compare(password, this.password);
	}
}