import conf from './conf';
import Bot from './resources/Discord/Bot';

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
        'Thanks, I hate it.',
        'You are a man of integrity just like me.',
    ],
};

const magnetMan = new Bot(config);

magnetMan.start();
