import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FortyTwoStrategy } from './strategies/42.stategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.registerAsync({
		  imports: [ConfigModule],
		  useFactory: async () => ({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: "21600s" }
		  }),
		  inject: [ConfigService],
		}),
	  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, FortyTwoStrategy]
})
export class AuthModule {}
