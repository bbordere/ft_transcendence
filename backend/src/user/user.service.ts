import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

	private static id: number = 1;

	getAllUsers(){
		return (this.usersRepository.find());
	}

	async createUser(user: CreateUserDto): Promise<User> {
		
		if (await this.getByName(user.name) != null)
			throw new NotAcceptableException('User Already Exist !');
		if (user.id == undefined){
			console.log(UserService.id)
			while (await this.getById(UserService.id) != null){
				UserService.id++;
			}
			user.id = UserService.id;
			UserService.id++;
		}
		const newUser = await this.usersRepository.create(user);
		await this.usersRepository.save(newUser);
		return newUser;
	}

	async getByName(username: string): Promise<User> {
		const retUser = await this.usersRepository.findOne({where: {name: username}});
		return (retUser);
	}

	async getById(id: number): Promise<User> {
		const retUser = this.usersRepository.findOne({where: {id: id}});
		return (retUser);
	}
}
