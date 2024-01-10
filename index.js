/**
 * index.js
 * 2024-01-09
 */

require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');

const {Client, Collection, GatewayIntentBits, REST, Routes} = require('discord.js');
const MusicPlayer = require('./src/musicPlayer');
const messageHandler = require('./src/messageHandler');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});

client.on('messageCreate', (message) => {
  messageHandler(client, message);
});
const musicPlayer = new MusicPlayer(client);

// load commands
const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

// register commands
client.on('ready', () => {
  console.log(`${client.user.tag} online`);

  const guildIds = client.guilds.cache.map(guild => guild.id);
  const rest = new REST({version: '9'}).setToken(process.env.TOKEN);
  for (const guildId of guildIds) {
    rest.put(Routes.applicationGuildCommands(process.env.CLIENTID, guildId), {
      body: commands
    })
    .then(() => console.log(`guild id: ${guildId}`))
    .catch(console.error);
  }
});

// setup event listener for incoming interactions
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute({client, interaction});
  } catch (err) {
    console.error(err);
    await interaction.reply('encountered error');
  }
});

client.login(process.env.TOKEN);