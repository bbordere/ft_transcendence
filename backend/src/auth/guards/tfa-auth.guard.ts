import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class Auth2fGuard extends AuthGuard('tfa') {
	// handleRequest(...args: Parameters<InstanceType<ReturnType<typeof AuthGuard>>['handleRequest']>) {
	// 	console.log(args);
	// 	return super.handleRequest(...args);
	//   }
}