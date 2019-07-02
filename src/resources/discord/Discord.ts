import discord, { Client, Message, TextChannel } from 'discord.js';

import {
    isFromTargetChannel,
    isFromBot,
    hasValidImage,
} from './Message';

type Config = {
    token: string,
    name: string,
    channel: string,
};

class Discord {
    client: Client;
    config: Config;

    constructor () {
        this.client = new discord.Client();

        this.handleReady = this.handleReady.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.handleWarn = this.handleWarn.bind(this);
    }

    get botId () {
        return this.client.user.id;
    }

    get targetChannel () {
        return this.config.channel;
    }

    log (...messages: any[]) {
        // TODO: Make this more robust
        console.log(...messages);
    }

    logStatus (status: string) {
        this.log(`${this.config.name} Status: ${status}`);
    }

    start (config: Config) {
        this.config = config;

        this.logStatus('Starting Up');

        this.client.on('ready', this.handleReady);
        this.client.on('error', this.handleError);
        this.client.on('message', this.handleMessage);
        this.client.on('warn', this.handleWarn);

        this.client.login(config.token);
    }

    handleReady () {
        this.logStatus('Ready');
    }

    handleError (message: Message) {
        this.logStatus('Heard Error');
        this.log(message);
    }

    handleWarn (message: Message) {
        this.logStatus('Heard Warn');
        this.log(message);
    }

    handleMessage (message: Message) {
        if (
            isFromTargetChannel(message, this.targetChannel) &&
            !isFromBot(message, this.botId) &&
            hasValidImage(message)
        ) {
            this.logStatus('Uploading Image');

            message.reply('A Fine Addition to my Collection!');

            // TODO Upload Image to Imgur Album

            this.logStatus('Upload Success');
        }
    }
};

export default new Discord();
