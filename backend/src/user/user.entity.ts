import { Column, Entity, PrimaryColumn, Generated, BeforeInsert } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity()
export class User{
	@PrimaryColumn()
	@Generated('increment')
	public id: number;

	@Column({ unique: true })
	public email: string;

	@Column({ unique: true })
	public name: string;

	@Column({ default: ""})
	private password: string;

	@Column({ default: true})
	public isOnline: boolean

	@Column({ default: false})
	public auth2f: boolean

	@Column({ default: ""})
	public auth2fSecret: string

	@Column({ default: ""})
	public pictureLink: string

	@Column({ default: ""})
	public accessToken: string

	@Column({ default: -1})
	public rank: number

	@Column({ default: 0})
	public matchPlayed: number

	@Column({ default: 0})
	public matchWin: number

	@BeforeInsert()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 8);
	}

	async validatePassword(password: string): Promise<boolean> {
		return await bcrypt.compare(password, this.password);
	}
}