import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';

export interface FortyTwoUser {
	id: number,
	login: string,
	email: string
}

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.FORTYTWO_ID,
      clientSecret: process.env.FORTYTWO_SECRET,
      callbackURL: "http://localhost:3000/auth/42/callback",
	  profileFields: {
		'id': function (obj) { return String(obj.id); },
		'username': 'login',
		'displayName': 'displayname',
		'name.familyName': 'last_name',
		'name.givenName': 'first_name',
		'profileUrl': 'url',
		'emails.0.value': 'email',
		'phoneNumbers.0.value': 'phone',
		'photos.0.value': 'image_url'
	  }
    });
  }

  validate(accessToken: string, refreshToken: string, profile: FortyTwoUser): FortyTwoUser{
		return profile;
  }
}

