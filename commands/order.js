/**
 * order.js
 * 2024-01-10
 */

const {SlashCommandBuilder} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('soberup')
    .setDescription('steady jam'),
  execute: async ({client, interaction}) => {
    const queue = client.player.queues.get(interaction.guildId);

    if (!queue)
      return interaction.reply('hollow jukebox')

    if (!queue.isShuffling)
      return interaction.reply('already sober and steady')

    queue.disableShuffle();
    await interaction.reply('sobered up jam');
  }
}