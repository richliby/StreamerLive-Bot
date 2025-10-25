export interface UserLevel {
	guild_id: string;
	user_id: string;
	xp?: number;
	level?: number;
	last_message?: Date;
}

export type UserLevelType = UserLevel;
