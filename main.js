import { Events } from 'discord.js';
import './levelSystem.js';
import * as dotenv from 'dotenv';
import { discordClient } from './src/api/index.js';

dotenv.config();
const token = process.env.DISCORD_TOKEN;
if(!token){
    throw new Error('DISCORD_TOKEN must be present in .env file')
}

// When the client is ready, run this code (only once)
discordClient.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Listen for new messages
discordClient.on('messageCreate', message => {
    if (message.content === '!ping') {
        message.reply('Pong!');
    }
});

// Log in to Discord with your client's token
discordClient.login(token);