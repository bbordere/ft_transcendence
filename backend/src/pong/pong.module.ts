import { Module } from '@nestjs/common';
import { PongGame } from './pong.service';
import { PongGateway } from './pong.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { PongController } from './pong.controller';
import { MatchModule } from 'src/match/match.module';
import { UserModule } from 'src/user/user.module';
import { RoomService } from './room.service';
import { GameService } from './game.service';

@Module({
  providers: [PongGateway, GameService, RoomService, PongGame,],
  imports: [AuthModule, MatchModule, UserModule],
  controllers: [PongController],
})
export class PongModule {}