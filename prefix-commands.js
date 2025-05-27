import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
import { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const PREFIX = "!";

const env = process.env;
if (!env.DISCORD_TOKEN || !env.CLIENT_ID) {
  console.error("Please set DISCORD_TOKEN and CLIENT_ID in your .env file.");
  process.exit(1);
}

// Slash Command Registration
const commands = [
  new SlashCommandBuilder().setName("ping").setDescription("Check bot latency."),
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);
(async () => {
  try {
    console.log("Registering slash commands...");
    await rest.put(Routes.applicationCommands(env.CLIENT_ID), { body: commands });
    console.log("Slash commands registered.");
  } catch (error) {
    console.error(error);
  }
});


// Handle Slash Commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong! 🏓");
  }
});

// Handle Prefix Commands
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;
  
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    message.channel.send("Pong! 🏓");
  }
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.Token);
