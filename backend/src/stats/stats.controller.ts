import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express'

@Controller('stats')
export class StatsController {
	constructor(private readonly userService: StatsService) {}

	@Get()
	async getAllStats(){
		return await this.userService.getAllStats();
	}

	@UseGuards(JwtAuthGuard)
	@Get('/me')
	async getMyStats(@Req() req: Request){
		return await this.userService.getPersonnalStats(req);
	}
}
