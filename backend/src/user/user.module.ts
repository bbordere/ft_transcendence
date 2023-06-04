import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { StatsDetail } from 'src/stats/stats.entity';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User, StatsDetail])],
  exports:[UserService]
})
export class UserModule {}
