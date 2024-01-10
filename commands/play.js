/**
 * play.js
 * 2024-01-09
 */

const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {GuildQueuePlayerNode, QueryType, QueueRepeatMode} = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('jam')
    .setDescription('jam')
    .addSubcommand(subcommand =>
      subcommand
        .setName('jar')
        .setDescription('jam time')
        .addStringOption(option =>
          option
            .setName('url')
            .setDescription('link')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('barrel')
        .setDescription('torrential jam time')
        .addStringOption(option =>
          option
            .setName('url')
            .setDescription('link')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('bazaar')
        .setDescription('jam shopping time')
        .addStringOption(option =>
          option
            .setName('keyword')
            .setDescription('text')
            .setRequired(true)
        )
    ),
  execute: async ({client, interaction}) => {
    if (!interaction.member.voice.channel)
      return interaction.reply('join voice to use this command');

    const queue = await client.player.queues.create(interaction.guild, {
      leaveOnEmpty: false,
      repeatMode: QueueRepeatMode.QUEUE   // cycle
    });
    const controller = new GuildQueuePlayerNode(queue);

    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    let embed = new EmbedBuilder();
    if (interaction.options.getSubcommand() == 'jar') {
      let url = interaction.options.getString('url');
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO
      });

      if (result.isEmpty())
        return interaction.reply('no such jam jar found');

      const song = result.tracks[0];
      await queue.addTrack(song);

      embed
        .setDescription(`added **[${song.title}][${song.url}]** to the jukebox`)
        .setThumbnail(song.thumbnail)
        .setFooter({text: `duration: ${song.duration}`});
    } else if (interaction.options.getSubcommand() == 'barrel') {
      let url = interaction.options.getString('url');
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST
      });

      if (result.isEmpty())
        return interaction.reply('no such jam barrel found');

      const playlist = result.playlist;
      await queue.addTrack(playlist);

      embed
        .setDescription(`added **[${playlist.title}][${playlist.url}]** to jukebox`)
        .setThumbnail(playlist.thumbnail)
        .setFooter({text: `duration: ${playlist.duration}`});
    } else if (interaction.options.getSubcommand() == 'bazaar') {
      let keyword = interaction.options.getString('keyword');
      const result = await client.player.search(keyword, {
        requestedBy: interaction.user,
        fallbackSearchEngine: QueryType.YOUTUBE_SEARCH,
      });

      if (result.isEmpty())
        return interaction.reply('no such jam in bazaar');

      const song = result.tracks[0];
      await queue.addTrack(song);

      embed
        .setDescription(`added **[${song.title}][${song.url}]** to jukebox`)
        .setThumbnail(song.thumbnail)
        .setFooter({text: `duration: ${song.duration}`});
    }

      await interaction.reply ({
        embeds: [embed]
      })

      if (!queue.isPlaying())
        await controller.play();
  }
}