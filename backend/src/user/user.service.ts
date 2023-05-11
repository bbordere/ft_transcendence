import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

	getAllUsers(){
		return (this.usersRepository.find());
	}

	async createUser(user: CreateUserDto): Promise<User> {
		const newUser = await this.usersRepository.create(user);
		await this.usersRepository.save(newUser);
		return newUser;
	}

	async createUserWithId(user: CreateUserDto, id: number): Promise<User>{
		const newUser = await this.usersRepository.create(user);
		newUser.id = id;
		console.log(newUser);
		await this.usersRepository.save(newUser);
		return newUser;
	}

	async getByName(username: string): Promise<User> {
		const retUser = await this.usersRepository.findOne({where: {name: username}});
		return (retUser);
	}

	async getById(id: number): Promise<User> {
		const retUser = await this.usersRepository.findOne({where: {id: id}});
		return (retUser);
	}
}
