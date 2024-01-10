/**
 * resume.js
 * 2024-01-09
 */

const {SlashCommandBuilder} = require('discord.js');
const {GuildQueuePlayerNode} = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('feast')
    .setDescription('feast on jam'),
  execute: async ({client, interaction}) => {
    const queue = client.player.queues.get(interaction.guildId);
    const controller = new GuildQueuePlayerNode(queue);

    if (!queue)
      return interaction.reply('hollow jukebox')

    controller.resume();
    await interaction.reply('jam feast time');
  }
}