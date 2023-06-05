import { Injectable, Req } from '@nestjs/common';
import { StatsDetail } from './stats.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express'

@Injectable()
export class StatsService {
	constructor(@InjectRepository(StatsDetail) private statsRepository: Repository<StatsDetail>) {}

	async getAllStats(){
		return this.statsRepository.find()
	}

	async getPersonnalStats(@Req() req: Request): Promise<StatsDetail>{
		const user = req["user"]["user"];
		return await this.statsRepository.findOne({
			where: {
				id: user["stats"]["id"]
			},
			loadRelationIds: true
		});
	}

	async getUserStats(statsId: number){
		return await this.statsRepository.findOne({
			where: {
				id: statsId
			},
			loadRelationIds: true
		});
	}
}
