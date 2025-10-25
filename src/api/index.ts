import axios from 'axios';
import { REST } from 'discord.js';

const { DISCORD_API_TOKEN, SUPABASE_API_URL } = process.env;

export const supabaseClient = axios.create({
    baseURL: SUPABASE_API_URL
});

if (!DISCORD_API_TOKEN) {
    throw new Error('DISCORD_API_TOKEN is not defined');
}
export const discordClient = new REST({ version: '10' }).setToken(DISCORD_API_TOKEN);
