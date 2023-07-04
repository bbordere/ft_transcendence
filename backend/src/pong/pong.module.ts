import { Module } from '@nestjs/common';
import { PongGame } from './pong.service';
import { PongGateway } from './pong.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { PongController } from './pong.controller';

@Module({
  providers: [PongGame, PongGateway],
  imports: [AuthModule],
  controllers: [PongController],
})
export class PongModule {}