import { Controller, Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsDetail } from './stats.entity';

@Module({
  providers: [StatsService],
  controllers: [StatsController],
  imports: [TypeOrmModule.forFeature([StatsDetail])],
  exports:[StatsService]

})
export class StatsModule {}
