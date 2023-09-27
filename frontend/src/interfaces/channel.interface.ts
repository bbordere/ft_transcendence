import type { Message } from './message.interface.ts';

export interface Channel {
	id: number;
	name: string;
	owner: number;
	messages: Message[],
	protected: boolean,
	isPrivate: boolean,
	admins: number[];
}