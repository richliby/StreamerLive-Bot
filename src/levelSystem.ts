import { User } from "./appdata/user";
import { db } from "./db";
import { Tables } from "./db/tables";
import { UserLevel } from "./db/types";

const XP_THRESHOLDS = [
  0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250 // Add more as needed
];
const DECAY_AMOUNT = 5;
const DECAY_HOURS = 24;

/** 
 * Should the user's level be stored in the users table in the database instead of calculated?
 * A Postgres function that runs in the database could automatically increment the user's level
 * A notification can then be sent to a Discord channel and/or email via webhook when the function is triggered
**/
function getLevelFromXP(xp: number) {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) return i;
  }
  return 0;
}

async function addXP(guildId: string, user: User, amount: number) {
  // return new Promise((resolve) => {
  //   db.get(`SELECT * FROM user_levels WHERE guild_id = ? AND user_id = ?`, [guildId, userId], (err, row) => {
  //     if (err) throw err;

  //     const now = Date.now();
  //     let xp = 0, level = 0, lastMessage = now;

  //     if (row) {
  //       xp = row.xp;
  //       lastMessage = new Date(row.last_message).getTime();
  //       const hoursSince = (now - lastMessage) / (1000 * 60 * 60);
  //       if (hoursSince >= DECAY_HOURS) {
  //         const decayRounds = Math.floor(hoursSince / DECAY_HOURS);
  //         xp = Math.max(0, xp - decayRounds * DECAY_AMOUNT);
  //       }
  //     }

  //     xp += amount;
  //     const newLevel = getLevelFromXP(xp);
  //     const leveledUp = !row || newLevel > row.level;

  //     db.run(`
  //       INSERT INTO user_levels (guild_id, user_id, xp, level, last_message)
  //       VALUES (?, ?, ?, ?, ?)
  //       ON CONFLICT(guild_id, user_id)
  //       DO UPDATE SET xp = ?, level = ?, last_message = ?;
  //     `, [
  //       guildId, userId, xp, newLevel, new Date(now).toISOString(),
  //       xp, newLevel, new Date(now).toISOString()
  //     ]);

  //     resolve({ leveledUp, level: newLevel });
  //   });
  // });
  try {
    // Fetch current user level data
    const { data, error, status } = await db
      .from(Tables.userLevels)
      .select('*')
      .eq('guild_id', guildId)
      .eq('user_id', user.userId)
      .maybeSingle();

    const now = new Date();
    let xp = 0, level = 0, lastMessage = now;

    // Only throw if error is not 'no row found'
    if (error && status !== 406 && status !== 200) {
      throw new Error(`Error fetching user level data: ${error.message}`);
    }

    if (data) {
      xp = data.xp ?? 0;
      lastMessage = data.last_message ? new Date(data.last_message) : now;
      const hoursSince = (now.getTime() - lastMessage.getTime()) / (1000 * 60 * 60);
      if (hoursSince >= DECAY_HOURS) {
        const decayRounds = Math.floor(hoursSince / DECAY_HOURS);
        xp = Math.max(0, xp - decayRounds * DECAY_AMOUNT);
      }
      level = data.level ?? 0;
    }

    xp += amount;
    const newLevel = getLevelFromXP(xp);
    const leveledUp = !data || newLevel > level;

    // Upsert user level data
    const upsertData = {
      guild_id: guildId,
      user_id: user.userId,
      xp,
      level: newLevel,
      last_message: now.toISOString(),
    };

    const { error: upsertError } = await db
      .from(Tables.userLevels)
      .upsert([upsertData], { onConflict: 'guild_id, user_id' });

    if (upsertError) {
      throw new Error(`Error updating user level data: ${upsertError.message}`);
    }

    return { leveledUp, level: newLevel };
  } catch (err) {
    console.log(err);
    return null;
  }

}

async function getUserData(user: User): Promise<User | null> {
  // return new Promise((resolve) => {
  //   db.get(`SELECT * FROM user_levels WHERE guild_id = ? AND user_id = ?`, [guildId, userId], (err, row) => {
  //     if (err) throw err;
  //     resolve(row || { xp: 0, level: 0 });
  //   });
  // });

  try {
    const { data, error, status } = await db
      .from(Tables.userLevels)
      .select('*')
      .eq('user_id', user.userId)
      .eq('guild_id', user.guildId)
      .maybeSingle();
    // Only throw if error is not 'no row found'
    if (error && status !== 406 && status !== 200) {
      throw new Error(`Error fetching data for user ${user.userId}`);
    } else if (data) {
      return User.fromDb(data);
    }
  } catch (error) {
    console.log(error);
  }
  return null;
}

async function getLeaderboard(guildId: string, limit = 10): Promise<User[] | null> {
  // return new Promise((resolve) => {
  //   db.all(`
  //     SELECT user_id, xp, level FROM user_levels
  //     WHERE guild_id = ?
  //     ORDER BY xp DESC LIMIT ?
  //   `, [guildId, limit], (err, rows) => {
  //     if (err) throw err;
  //     resolve(rows);
  //   });
  // });
  try {
    const { data, error } = await db
      .from(Tables.userLevels)
      .select('*')
      .eq('guild_id', guildId)
      .limit(limit)
    if (error) {
      throw new Error(`Error getting leaderboard for guild ${guildId}`)
    } else if (data) {
      const leaderboard: UserLevel[] = data as UserLevel[];
      return leaderboard.map((slot) => User.fromDb(slot)).sort((a, b) => b.xp - a.xp);
    }
  } catch (error) {
    console.log(error)
  }
  return null;
}

export default {
  addXP,
  getUserData,
  getLeaderboard,
};
