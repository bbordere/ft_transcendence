import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { Match } from './match.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [MatchService],
  controllers: [MatchController],
  imports: [TypeOrmModule.forFeature([Match]), UserModule],
  exports:[MatchService]
})
export class MatchModule {}




