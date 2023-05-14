import { Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthLoginDto } from './dtos/auth.dto';
import { User } from 'src/user/user.entity';
import { AuthLogin42Dto } from './dtos/auth42.dto';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {
	constructor(private usersService: UserService, private jwtService: JwtService) {}

	async login(authLoginDto: AuthLoginDto) {
		const user = await this.validateUser(authLoginDto);
	
		const payload = { username: user.name, email: user.email};
		const access_token = this.jwtService.sign(payload);
		await this.usersService.updateAccessToken(user.email, access_token);
		return {access_token: access_token};
	  }

	async validateUser(authLoginDto: AuthLoginDto): Promise<User> {
		const { email, password } = authLoginDto;

		const user = await this.usersService.getByEmail(email);
		if (!user) throw new NotAcceptableException('User not found');

		const validPass = await user.validatePassword(password)

		if (!validPass) throw new UnauthorizedException();

		return user;
	}

	async login42(data: AuthLogin42Dto) {
		const user = await this.usersService.getByEmail(data.email);
		if (!user)
		{
			if (await this.usersService.getByName(data.name))
				throw new NotAcceptableException('User Already Exist !');
			const user = await this.usersService.createUser42(data);
			const payload = { username: user.name, email: user.email};
			return {access_token: this.jwtService.sign(payload)};
		}
		const payload = { username: user.name, email: user.email};
		return {access_token: this.jwtService.sign(payload)};
	}

	async generate2FASecret(user: User){
		const secret = authenticator.generateSecret();
		console.log(user);
		const otpAuthUrl = authenticator.keyuri(user.email, "ft_transcendence", secret);
		await this.usersService.set2faSecret(secret, user.id);
		return {secret, otpAuthUrl: otpAuthUrl};
	}

	async generateQrCode(url: string){
		return (toDataURL(url));
	}

	isValidCode(user: User, code: string): boolean{
		return (authenticator.verify({token: code, secret: user.auth2fSecret}));
	}


	async getCookieWithJwtToken(email: string) {
		const user = await this.usersService.getByEmail(email);
		const payload = { username: user.name, email: user.email};
		const token = this.jwtService.sign(payload);
		return `Authentication=${token}; HttpOnly; Path=/; Max-Age=3600s}`;
	  }
}