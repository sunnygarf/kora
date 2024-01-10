/**
 * queue.js
 * 2024-01-09
 */

const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('jukebox')
    .setDescription('show me the jam'),
  execute: async ({client, interaction}) => {
    const queue = client.player.queues.get(interaction.guildId);

    if (!queue)
      return interaction.reply('hollow jukebox')

    const queueString = queue.tracks.map((song, i) => {
      return `${i + 1}. [${song.duration}] ${song.title} - <@${song.requestedBy.id}>`;
    }).join('\n');

    const currentSong = queue.currentTrack;

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`current playing:\n \`${currentSong.title}\` - <@${currentSong.requestedBy.id}>\n\n queue:\n ${queueString}`)
          .setThumbnail(currentSong.thumbnail)
      ]
    })
  }
}