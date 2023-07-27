import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsDetail } from 'src/stats/stats.entity';
import { ChatModule } from 'src/chat/chat.module';
import { Channel } from 'src/chat/entities/channel.entity';
import { ChannelPerms } from 'src/chat/entities/channelPerms.entity';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User, StatsDetail, Channel, ChannelPerms]), ChatModule],
  exports:[UserService]
})
export class UserModule {}
