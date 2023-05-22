import { Column, Entity } from "typeorm";

@Entity()
export class Message {

	//Adding constraints and foreign keys
	@Column({ })
	public content: string;
	public sender: number;
	public receiver: number;
	public date: Date;

}