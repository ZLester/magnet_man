import conf from './conf';
import discord from './resources/discord/';

const config = {
    name: 'Magnet Man',
    token: conf.discordToken,
    channel: conf.discordChannel,
};

discord.start(config);
