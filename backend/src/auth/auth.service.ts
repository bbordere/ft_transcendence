import { Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthLoginDto } from './auth.dto';
import { User } from 'src/user/user.entity';
import { FortyTwoStrategy, FortyTwoUser } from './42/42.stategy';
import { log } from 'console';


@Injectable()
export class AuthService {
	constructor(private usersService: UserService, private jwtService: JwtService) {}

	async login(authLoginDto: AuthLoginDto) {
		const user = await this.validateUser(authLoginDto);
	
		const payload = {userId: user.id};
	
		return {access_token: this.jwtService.sign(payload)};
	  }

	async validateUser(authLoginDto: AuthLoginDto): Promise<User> {
		const { name, password } = authLoginDto;

		const user = await this.usersService.getByName(name);
		if (!user) throw new NotAcceptableException('User not found');

		const validPass = await user?.validatePassword(password)

		if (!validPass) throw new UnauthorizedException();

		return user;
	}

	async login42(data: any) {
		const user = await this.usersService.getById(data.id);
		if (!user)
		{
			try{
				this.usersService.createUser({"name": data.username, "password": "42", "id": data.id});
				const payload = { username: data.username, sub: data.id};
				return {access_token: this.jwtService.sign(payload)};
			}
			catch (error)
			{
				console.log(error);
			}
		}
		const payload = { username: user.name, sub: user.id};
		return {access_token: this.jwtService.sign(payload)};
	}
}
