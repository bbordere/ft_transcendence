import { IsNotEmpty, IsNumber } from 'class-validator';

export class AuthLoginDto {
	@IsNotEmpty()
	name: string;

	password: string;

	@IsNumber()
	id: number;
}