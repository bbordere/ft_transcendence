
import { Injectable, NotAcceptableException, ValidationError } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthRegisterDto } from 'src/auth/dtos/auth.dto';
import { AuthLogin42Dto } from 'src/auth/dtos/auth42.dto';
import { StatsDetail } from 'src/stats/stats.entity';
import { validate } from 'class-validator';

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

	async getErrorMsg(errors: ValidationError[]): Promise<string>{
		let res: string = "";
		if (errors[0]["property"] === "email")
			res += "Adresse Email ";
		else if (errors[0]["property"] === "password")
			res += "Mot de passe ";
		return (res += "invalide !");
	}

	getAllUsers(): Promise<string[]>{
		// return (this.usersRepository.find({select: {name: true}}));
		const names = this.usersRepository
		.createQueryBuilder('entity')
		.select('entity.name', 'name')
		.getRawMany();
		return names.then(names => names.map((res) => res.name))
	}

	async createUser(user: AuthRegisterDto): Promise<User> {
		const errors: ValidationError[] = await validate(user);
		if (errors.length)
			throw new NotAcceptableException(await this.getErrorMsg(errors));
		if (await this.getByEmail(user.email) != null)
			throw new NotAcceptableException('Email déjà utilisé !');
		if (await this.getByName(user.name) != null)
			throw new NotAcceptableException('Pseudo déjà utilisé !');
		const newUser = await this.usersRepository.create(user);
		newUser.stats = new StatsDetail();
		await this.usersRepository.save(newUser);
		this.updatePictureLink(user.email);
		return newUser;
	}

	async createUser42(data: AuthLogin42Dto): Promise<User> {
		let i: number = 1;
		while(await this.getByName(data.name) != null)
			data.name += i++;
		data.password = Math.random().toString(36).slice(-8);
		const user = await this.usersRepository.create(data);
		user.stats = new StatsDetail();
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

	async disable2fa(id: number){
		const user = await this.getById(id);
		user.auth2f = false;
		this.usersRepository.save(user);
	}

	async updatePictureLink(email: string, link: string = "http://" + process.env.HOST + ":3000/avatar/default.jpg"){
		const user = await this.getByEmail(email);
		user.avatarLink = link;
		await this.usersRepository.save(user);
	}

	async updateUsername(email: string, username: string){
		const user = await this.getByEmail(email);
		if (await this.getByName(username) != null)
			return (false);
		user.name = username;
		await this.usersRepository.save(user);
		return (true);
	}

	async saveUser(user: User){
		this.usersRepository.save(user);
	}

	async getEmailByUsername(username: string): Promise<string>{
		const user = (await this.usersRepository.findOne({where: {name: username}}));
		if (!user)
			throw new NotAcceptableException('User not found');
		return (user.email);
	}
}
