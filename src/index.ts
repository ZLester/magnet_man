import conf from './conf';
import Discord from './resources/discord/';
import Imgur from './resources/imgur/';

export type Config = {
    channel: string,
    clientId: string,
    clientSecret: string,
    extensions: string[],
    name: string,
    refreshToken: string,
    replies: string[],
    token: string,
};

const config = {
    name: 'Magnet Man',
    token: conf.discordToken,
    channel: conf.discordChannel,
    extensions: [
        'jpg',
        'jpeg',
        'png',
        'gif',
    ],
    replies: [
        'This will make a fine addition to my collection!',
        'You are a man of integrity just like me.',
        'Thanks, I hate it.',
    ],
    clientId: conf.imgurClientId,
    clientSecret: conf.imgurClientSecret,
    refreshToken: conf.imgurRefreshToken,
};


class Bot {
    config: Config;
    client: Discord;

    constructor (config: Config) {
        this.config = config;

        this.client = new Discord(config, new Imgur(config));
    }

    start () {
        this.client.start();
    }
}

const magnetMan = new Bot(config);

magnetMan.start();
