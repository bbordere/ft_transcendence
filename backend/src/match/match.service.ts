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

	async filterMatchesEntry(matches: Match[]){
		const test = matches.map((match) => {
			const { player1, player2, ...rest } = match;
			const { password: password1, auth2fSecret: auth1, ...player1WithoutPassword } = player1;
			const { password: password2, auth2fSecret: auth2,...player2WithoutPassword } = player2;
			return {
			  ...rest,
			  player1: player1WithoutPassword,
			  player2: player2WithoutPassword,
			};
		})
		return (test);
	}

	async getAllMatches(){
		const matches: Match[] =  await this.matchRepository.find();
		return (await this.filterMatchesEntry(matches));
	}

	async createMatch(matchDto: MatchDto, userService: UserService, statsService: StatsService){
		const match = this.matchRepository.create(matchDto);
		match.player1 =  await userService.getPartialUser(await userService.getById(matchDto.player1Id));
		match.player2 = await userService.getPartialUser(await userService.getById(matchDto.player2Id));
		if (!match.player1 || !match.player2)
			return;
		await statsService.updateStats(match, match.player1, 1);
		await statsService.updateStats(match, match.player2, 2);
		match.player1.stats.mmr = Math.ceil(await statsService.getUpdatedMmr(match.scorePlayer1, match.scorePlayer2, match.player1.stats.mmr, match.player2.stats.mmr));
		match.player2.stats.mmr = Math.ceil(await statsService.getUpdatedMmr(match.scorePlayer2, match.scorePlayer1, match.player2.stats.mmr, match.player1.stats.mmr));
		await userService.saveUser(match.player1);
		await userService.saveUser(match.player2);
		await this.matchRepository.save(match);
	}

	async getMyMatches(req: Request){
		const user = req["user"]["user"];
		const matches: Match[] = await this.matchRepository.find({
			where: [ { player1 : user }, { player2: user }],
			order: {
				id: 'DESC'
			},
			// loadRelationIds: true
		});
		return (await this.filterMatchesEntry(matches));
	}
	
	async getUserMatches(user){
		const user2 = user;
		const matches: Match[] = await this.matchRepository.find({
			where: [{player1: user2}, {player2: user}],
			order: {
				id: 'DESC'
			},
			// loadRelationIds: true
		})
		return (await this.filterMatchesEntry(matches));
	};
}
