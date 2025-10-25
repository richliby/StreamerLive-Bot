import { Routes, SlashCommandBuilder } from 'discord.js';
import { restClient } from './api';

const { DISCORD_CLIENT_ID } = process.env;

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

(async () => {
    try {
        console.log('⏳ Registering slash commands...');
        await restClient.put(Routes.applicationCommands(DISCORD_CLIENT_ID), { body: commands });
        console.log('✅ Slash commands registered successfully!');
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
})();
