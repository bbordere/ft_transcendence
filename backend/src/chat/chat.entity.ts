import { Column, Entity, Generated, PrimaryColumn } from "typeorm";

@Entity()
export class Channel {
	@PrimaryColumn()
	@Generated('increment')
	public id: number;

	@Column({ unique: true })
	public name: string;
};