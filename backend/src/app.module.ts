import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChatGateway } from './chat/chat.gateway';
import { PongGateway } from './pong/pong.gateway';

import { AppService } from './app.service';
import { AvatarModule } from './avatar/avatar.module';
import { StatsController } from './stats/stats.controller';
import { StatsModule } from './stats/stats.module';
import { MatchController } from './match/match.controller';
import { MatchModule } from './match/match.module';
import { PongGame } from './pong/pong.service';

@Module({
  imports: [
		DatabaseModule,
		UserModule,
		AuthModule,
		ServeStaticModule.forRoot({rootPath: join(__dirname, '..', 'qrcode'), serveRoot: '/qrcode',}),
		AvatarModule,
		StatsModule,
		MatchModule,
	],
  controllers: [AppController, StatsController, MatchController],
  providers: [AppService, ChatGateway, PongGateway, PongGame]
})
export class AppModule {}
