export interface IUser {
	guildId: string;
	userId: string;
	xp?: number;
	level?: number;
	lastMessage?: Date;
}

export type UserType = {
	guildId: string;
	userId: string;
	xp?: number;
	level?: number;
	lastMessage?: Date;
};

export class User implements IUser {
	guildId: string;
	userId: string;
	xp: number;
	level: number;
	lastMessage: Date;

	constructor({ guildId, userId, xp = 0, level = 0, lastMessage = new Date() }: IUser) {
		this.guildId = guildId;
		this.userId = userId;
		this.xp = xp;
		this.level = level;
		this.lastMessage = lastMessage;
	}
}
