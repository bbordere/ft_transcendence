import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';

export interface FortyTwoUser {
	id: number,
	name: string,
	email: string
	photo: string
}

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.FORTYTWO_ID,
      clientSecret: process.env.FORTYTWO_SECRET,
      callbackURL: "http://"+process.env.HOST+":3000/auth/42/callback",
	  profileFields: {
		'id': function (obj) { return String(obj.id); },
		'name': 'login',
		'email': 'email',
		'photo': 'image_url'
	  }
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: FortyTwoUser){
		return await this.authService.findOrCreate(profile);
  }
}

