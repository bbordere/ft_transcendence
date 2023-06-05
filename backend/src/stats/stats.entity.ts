import { Column, Entity, Generated, PrimaryColumn } from "typeorm";

@Entity()
export class StatsDetail{
	@PrimaryColumn()
	@Generated('increment')
	id: number

	@Column({ default: 0})
	wins: number

	@Column({ default: 0})
	looses: number

	@Column({ default: 0})
	mmr: number

	@Column({ default: 0})
	meanScore: number

	@Column({ default: 0})
	winPoints: number

	@Column({ default: 0})
	loosePoints: number

	@Column({ default: 0})
	highScore: number

	@Column({ default: 0})
	totalGames: number

	@Column({ default: 0})
	totalClassicGames: number

	@Column({ default: 0})
	friendDuel: number

	@Column({ default: 0})
	totalPowerups: number

	@Column({ default: 0})
	totalMessages: number

	@Column({ default: 0})
	totalEmotes: number
}