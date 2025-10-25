import dotenv from 'dotenv';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';

dotenv.config();
const env = process.env;
const { DISCORD_CLIENT_ID, DISCORD_API_TOKEN } = env;

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    new SlashCommandBuilder().setName('echo').setDescription('Repeats your message')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message to echo')
                .setRequired(true)
        ),
    new SlashCommandBuilder().setName('random').setDescription('Generates a random number'),
    new SlashCommandBuilder().setName('userinfo').setDescription('Displays your user info'),
].map(command => command.toJSON());

if (!DISCORD_CLIENT_ID) {
    throw new Error('DISCORD_CLIENT_ID environment variable is not defined.');
}
if (!DISCORD_API_TOKEN) {
    throw new Error('DISCORD_API_TOKEN environment variable is not defined.');
}

const rest = new REST({ version: '10' }).setToken(DISCORD_API_TOKEN);
(async () => {
    try {
        console.log('⏳ Registering slash commands...');
        await rest.put(Routes.applicationCommands(env.CLIENT_ID as string), { body: commands });
        console.log('✅ Slash commands registered successfully!');
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
})();