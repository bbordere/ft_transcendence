import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChatGateway } from './chat/chat.gateway';
import { AppService } from './app.service';
import { AvatarModule } from './avatar/avatar.module';

@Module({
  imports: [
		DatabaseModule,
		UserModule,
		AuthModule,
		ServeStaticModule.forRoot({rootPath: join(__dirname, '..', 'qrcode'), serveRoot: '/qrcode',}),
		AvatarModule,
	],
  controllers: [AppController],
  providers: [AppService, ChatGateway]
})
export class AppModule {}
