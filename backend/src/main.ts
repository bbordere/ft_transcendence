import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	// app.enableCors({allowedHeaders: ['content-type'],origin: 'http://localhost:3000',credentials: true,});
	app.enableCors({origin: '*'});
	app.useGlobalPipes(new ValidationPipe());
	await app.listen(3000);
}
bootstrap();
