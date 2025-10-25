import { UserLevelType } from "../db/types";

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

	fromDb(res: UserLevelType){
		return new User({
			guildId: res.guild_id,
			userId: res.user_id,
			xp: res.xp,
			level: res.level,
			lastMessage: res.last_message ? new Date(res.last_message) : new Date()
		});
	}
}
