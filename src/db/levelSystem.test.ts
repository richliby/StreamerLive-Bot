import levelSystem from '../levelSystem';
import { User } from '../appdata/user';
import { db } from '../db';
import { Tables } from '../db/tables';

describe('levelSystem', () => {
  const testGuildId = 'test-guild';
  const testUserId = 'test-user';
  let testUser: User;

  beforeAll(async () => {
    // Clean up test user in DB
    await db.from(Tables.userLevels)
      .delete()
      .eq('guild_id', testGuildId)
      .eq('user_id', testUserId);
    // Create test user
    testUser = new User({ guildId: testGuildId, userId: testUserId });
  });

  afterAll(async () => {
    // Clean up test user in DB
    await db.from(Tables.userLevels)
      .delete()
      .eq('guild_id', testGuildId)
      .eq('user_id', testUserId);
  });

  test('addXP should add XP and update level', async () => {
    const result = await levelSystem.addXP(testGuildId, testUser, 150);
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    expect(result!.level).toBeGreaterThanOrEqual(1);
  });

  test('getUserData should return user data', async () => {
    const userData = await levelSystem.getUserData(testUser);
    expect(userData).not.toBeNull();
    expect(userData?.xp).toBeGreaterThanOrEqual(0);
    expect(userData?.level).toBeGreaterThanOrEqual(0);
  });

  test('getLeaderboard should return array of users', async () => {
    const leaderboard = await levelSystem.getLeaderboard(testGuildId, 5);
    expect(Array.isArray(leaderboard)).toBe(true);
    if (leaderboard && leaderboard.length > 0) {
      expect(leaderboard[0]).toHaveProperty('xp');
      expect(leaderboard[0]).toHaveProperty('level');
    }
  });
});
