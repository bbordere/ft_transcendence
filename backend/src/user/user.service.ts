import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthLoginDto } from 'src/auth/dtos/auth.dto';
import { AuthLogin42Dto } from 'src/auth/dtos/auth42.dto';

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

	getAllUsers(){
		return (this.usersRepository.find());
	}

	async createUser(user: AuthLoginDto): Promise<User> {
		
		if (await this.getByEmail(user.email) != null || await this.getByName(user.name) != null )
			throw new NotAcceptableException('User Already Exist !');
		const newUser = await this.usersRepository.create(user);
		await this.usersRepository.save(newUser);
		return newUser;
	}

	async createUser42(data: AuthLogin42Dto): Promise<User> {
		data.password = Math.random().toString(36).slice(-8);
		const user = await this.usersRepository.create(data);
		await this.usersRepository.save(user);
		return user;
	}

	async getByEmail(email: string): Promise<User> {
		const retUser = await this.usersRepository.findOne({where: {email: email}});
		return (retUser);
	}

	async getByName(name: string): Promise<User> {
		const retUser = await this.usersRepository.findOne({where: {name: name}});
		return (retUser);
	}

	async getById(id: number): Promise<User> {
		const retUser = this.usersRepository.findOne({where: {id: id}});
		return (retUser);
	}

	async set2faSecret(secret: string, id: number){
		const user = await this.getById(id);
		user.auth2fSecret = secret;
		await this.usersRepository.save(user);
	}

	async enable2fa(id: number){
		const user = await this.getById(id);
		user.auth2f = true;
		this.usersRepository.save(user);
	}

	async updateAccessToken(email: string, token: string){
		const user = await this.getByEmail(email);
		user.accessToken = token;
		this.usersRepository.save(user);
	}
}
