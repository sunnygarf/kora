/**
 * pause.js
 * 2024-01-09
 */

const {SlashCommandBuilder} = require('discord.js');
const {GuildQueuePlayerNode} = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fridge')
    .setDescription('put jam in fridge'),
  execute: async ({client, interaction}) => {
    const queue = client.player.queues.get(interaction.guildId);
    const controller = new GuildQueuePlayerNode(queue);

    if (!queue)
      return interaction.reply('hollow jukebox')

    controller.pause();
    await interaction.reply('storing jam safely in fridge');
  }
}