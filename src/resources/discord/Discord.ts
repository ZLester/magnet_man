import discord, { Client, Message, TextChannel } from 'discord.js';
import Imgur from '../imgur/';
import { Config } from '../../';

import {
    getImageUrls,
    getRandomString,
    hasValidImage,
    isFromTargetChannel,
    isNotFromBot,
} from './Message';

class Discord {
    client: Client;
    config: Config;
    imgur: Imgur;

    constructor (config: Config, imgur: Imgur) {
        this.config = config;
        this.client = new discord.Client();
        this.imgur = imgur;

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

    start () {
        console.log('Discord Start: Request');

        this.client.on('ready', this.handleReady);
        this.client.on('error', this.handleError);
        this.client.on('message', this.handleMessage);
        this.client.on('warn', this.handleWarn);

        this.client.login(this.config.token);
    }

    handleReady () {
        console.log('Discord Start: Success');
    }

    handleError (message: Message) {
        console.log('Discord Error');
        console.log(message);
    }

    handleWarn (message: Message) {
        console.log('Discord Warn');
        console.log(message);
    }

    async handleMessage (message: Message) {
        if (
            isFromTargetChannel(message, this.targetChannel) &&
            isNotFromBot(message, this.botId) &&
            hasValidImage(message, this.config.extensions)
        ) {
            console.log('Uploading Image');

            const urls = getImageUrls(message, this.config.extensions);

            const albums = await this.imgur.getAlbums();
            const album = albums.find(
                (album: { id: string, title: string, link: string }) => album.title === message.guild.name
            );

            if (!album) {
                console.log(`First Time Setup for ${message.guild.name}`);

                message.channel.send('Looks like this is the first time you\'ve uploaded something on this Discord.');
                message.channel.send('I\'ll create a new Imgur Album for you, just give me a sec…');

                const newAlbumData = await this.imgur.createAlbum(message.guild.name);
                const newAlbum = await this.imgur.getAlbum(newAlbumData.id);

                await Promise.all(
                    urls.map(url => this.imgur.uploadImageToAlbum(url, newAlbum.id))
                );

                message.channel.send(`OK, done. You can check out your Discord's Album over at <${newAlbum.link}>`)
            } else {
                await Promise.all(
                    urls.map(url => this.imgur.uploadImageToAlbum(url, album.id))
                );

                message.channel.send(getRandomString(this.config.replies));
                message.channel.send(`<${album.link}>`);
                console.log('Upload Success');
            }
        }
    }
};

export default Discord;
