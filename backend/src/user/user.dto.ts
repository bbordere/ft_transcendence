import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateUserDto {
	@IsNotEmpty()
	name: string;

	password: string;

	@IsNumber()
	id: number;
}