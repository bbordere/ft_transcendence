import { Injectable, NotAcceptableException, UnauthorizedException, Req, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthLoginDto } from './dtos/auth.dto';
import { User } from 'src/user/user.entity';
import { AuthLogin42Dto } from './dtos/auth42.dto';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { FortyTwoUser } from './strategies/42.stategy';

@Injectable()
export class AuthService {
	constructor(private usersService: UserService, private jwtService: JwtService) {}

	async login(authLoginDto: AuthLoginDto, @Res() res) {
		const user = await this.validateUser(authLoginDto, res);
	
		const payload = { username: user.name, email: user.email};
		const access_token = this.jwtService.sign(payload);
		await this.usersService.updateAccessToken(user.email, access_token);
		// res.cookie('token', access_token);
		return {access_token: access_token};
	  }

	async validateUser(authLoginDto: AuthLoginDto, @Res({ passthrough: true }) res): Promise<User> {
		const { email, password } = authLoginDto;

		const user = await this.usersService.getByEmail(email);
		if (!user) throw new NotAcceptableException('User not found');

		const validPass = await user.validatePassword(password)

		if (!validPass) throw new UnauthorizedException();

		if (user.auth2f === true)
			res.redirect("http://localhost:8080/verif");

		return user;
	}

	async login42(@Req() req, @Res({ passthrough: true }) res, data: AuthLogin42Dto) {
		const user = await this.usersService.getByEmail(data.email);
		if (!user)
		{
			if (await this.usersService.getByName(data.name))
				throw new NotAcceptableException('User Already Exist !');
			const user = await this.usersService.createUser42(data);
			const payload = { username: user.name, email: user.email};
			res.redirect("http://localhost:8080/");
			return {access_token: this.jwtService.sign(payload)};
		}
		if (user.auth2f === true)
		{
			const payload = { username: user.name, email: user.email};
			res.redirect("http://localhost:8080/verif");
			return {access_token: this.jwtService.sign(payload)};
		}
		else
		{
			const payload = { username: user.name, email: user.email};
			res.redirect("http://localhost:8080/");
			return {access_token: this.jwtService.sign(payload)};
		}
		//to do redirect to front home page
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


	async getTokenByMail(email: string): Promise<string> {
		const user = await this.usersService.getByEmail(email);
		const payload = { username: user.name, email: user.email};
		const token: string = this.jwtService.sign(payload);
		return (token);
	  }
	
	async getTokenByUser(user: User): Promise<string> {
		const payload = { username: user.name, email: user.email};
		const token: string = this.jwtService.sign(payload);
		return (token);
	}

    async findOrCreate(loginDto: AuthLogin42Dto): Promise<User> {
        try {
            const user = await this.usersService.getByEmail(loginDto.email);
            if (!user)
                return await this.usersService.createUser42(loginDto);
            return (user);
        }
		catch (error) {
            console.log(error);
            throw new NotAcceptableException('findOrCreate');
        }
    }
}