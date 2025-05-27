// main.js
const { Client, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config(); // Load environment variables from .env
const levelSystem = require('./levelSystem'); // Import the level system module
const token = process.env.TOKEN;

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