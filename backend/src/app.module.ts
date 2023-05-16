import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
		DatabaseModule,
		UserModule,
		AuthModule,
		ServeStaticModule.forRoot({rootPath: join(__dirname, '..', 'qrcode'), serveRoot: '/qrcode',}),
	],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
