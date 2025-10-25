import { SlashCommandBuilder, Routes } from "discord.js";
import { discordClient, restClient } from './api';
import { appConfig } from "./config";

const { DISCORD_CLIENT_ID, DISCORD_TOKEN } = process.env;
const PREFIX = appConfig.cmdPrefix;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  console.error("Please set DISCORD_TOKEN and CLIENT_ID in your .env file.");
  process.exit(1);
}

// Slash Command Registration
const commands = [
  new SlashCommandBuilder().setName("ping").setDescription("Check bot latency."),
].map(command => command.toJSON());

(async () => {
  try {
    console.log("Registering slash commands...");
    await restClient.put(Routes.applicationCommands(DISCORD_CLIENT_ID), { body: commands });
    console.log("Slash commands registered.");
  } catch (error) {
    console.error(error);
  }
});


// Handle Slash Commands
discordClient.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong! 🏓");
  }
});

// Handle Prefix Commands
discordClient.on("messageCreate", async (message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;
  
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift();
  const commandName = command ? command.toLowerCase() : "";

  if (commandName === "ping") {
    message.channel.send("Pong! 🏓");
  }
});

discordClient.once("ready", () => {
  if (discordClient.user) {
    console.log(`Logged in as ${discordClient.user.tag}`);
  } else {
    console.log("Logged in, but client.user is null.");
  }
});

discordClient.login(DISCORD_TOKEN);
