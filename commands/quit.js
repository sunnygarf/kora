/**
 * quit.js
 * 2024-01-09
 */

const {SlashCommandBuilder} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stuffed')
    .setDescription('no more jam for stuffed turkey'),
  execute: async ({client, interaction}) => {
    const queue = client.player.queues.get(interaction.guildId);

    if (!queue)
      return interaction.reply('hollow jukebox')

    client.player.queues.delete(interaction.guildId);
    await interaction.reply('get stuffed');
  }
}