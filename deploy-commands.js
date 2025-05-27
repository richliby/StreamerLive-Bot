// require('dotenv').config();
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

const env = process.env;
const {REST, Routes, SlashCommandBuilder } = require('discord.js');

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

const rest = new REST({ version: '10' }).setToken(env.TOKEN);

(async () => {
    try {
        console.log('⏳ Registering slash commands...');
        await rest.put(Routes.applicationCommands(env.CLIENT_ID), { body: commands });
        console.log('✅ Slash commands registered successfully!');
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
})();
// Compare this snippet from package.json: