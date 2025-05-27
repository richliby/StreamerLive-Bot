// main.js
import { Client, Events, GatewayIntentBits } from 'discord.js';
import './levelSystem.js'; // Import the level system module
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file
const token = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Listen for new messages
client.on('messageCreate', message => {
    if (message.content === '!ping') {
        message.reply('Pong!');
    }
});

// Log in to Discord with your client's token
client.login(token);