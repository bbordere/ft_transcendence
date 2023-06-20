import { Module } from '@nestjs/common';
import { PongGame } from './pong.service';
import { PongGateway } from './pong.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [PongGame, PongGateway],
  imports: [AuthModule],
})
export class AppModule {}