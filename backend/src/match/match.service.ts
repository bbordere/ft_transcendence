import { Injectable, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './match.entity';
import { MatchDto } from './match.dto';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';
import { StatsService } from 'src/stats/stats.service';

@Injectable()
export class MatchService {
	constructor(@InjectRepository(Match) private matchRepository: Repository<Match>) {}

	async getAllMatches(){
		return await this.matchRepository.find();
	}

	async createMatch(matchDto: MatchDto, userService: UserService, statsService: StatsService){
		const match = this.matchRepository.create(matchDto);
		match.player1 = await userService.getById(matchDto.player1Id);
		match.player2 = await userService.getById(matchDto.player2Id);
		if (!match.player1 || !match.player2)
			return;
		await statsService.updateStats(match, match.player1, 1);
		await statsService.updateStats(match, match.player2, 2);
		await userService.saveUser(match.player1);
		await userService.saveUser(match.player2);
		this.matchRepository.save(match);
	}

	async getMyMatches(req: Request){
		const user = req["user"]["user"];
		return await this.matchRepository.find({
			where: [ { player1 : user }, { player2: user }],
			order: {
				id: 'DESC'
			},
			// loadRelationIds: true
		});
	}

	async getUserMatches(user){
		const user2 = user;
		return await this.matchRepository.find({
			where: [{player1: user2}, {player2: user}],
			order: {
				id: 'DESC'
			},
			// loadRelationIds: true
		})
	}
}
