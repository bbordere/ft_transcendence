import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt/jwt.strategy';
import { FortyTwoStrategy } from './42/42.stategy';

@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.registerAsync({
		  imports: [ConfigModule],
		  useFactory: async () => ({
			secret: process.env.JWT_SECRET,
		  }),
		  inject: [ConfigService],
		}),
	  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, FortyTwoStrategy]
})
export class AuthModule {}
