import { Module } from '@nestjs/common';
import { PongGame } from './pong.service';
import { PongGateway } from './pong.gateway';

@Module({
  providers: [PongGame, PongGateway],
})
export class AppModule {}