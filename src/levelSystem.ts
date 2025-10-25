import { db } from "./db";

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

function addXP(guildId: string, userId: string, amount: number) {

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


}

function getUserData(guildId: string, userId: string) {
  // return new Promise((resolve) => {
  //   db.get(`SELECT * FROM user_levels WHERE guild_id = ? AND user_id = ?`, [guildId, userId], (err, row) => {
  //     if (err) throw err;
  //     resolve(row || { xp: 0, level: 0 });
  //   });
  // });
}

function getLeaderboard(guildId: string, limit = 10) {
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
}

export default {
  addXP,
  getUserData,
  getLeaderboard,
};
