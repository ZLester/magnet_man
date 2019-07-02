import {
    Collection,
    Message,
    MessageAttachment,
} from 'discord.js';

import { isTextChannel } from './Channel';

export const isFromTargetChannel = (message: Message, targetChannel: string) =>
    isTextChannel(message.channel) && message.channel.name === targetChannel;

export const isNotFromBot = (message: Message, botId: string) =>
    message.author.id !== botId;

export const hasValidImage = (message: Message, validExtensions: string[]) =>
    message.attachments.size > 0 &&
    [ ...message.attachments ].some(([ _, attachment ]) => {
        const parts = attachment.url.split('.');
        const extension = parts[parts.length - 1];
        return validExtensions.includes(extension);
    });

const getRandomNumber = (max: number) => Math.floor(Math.random() * max);
const getRandomValue = <T>(arr: T[]): T => arr[getRandomNumber(arr.length)];

export const getRandomString = (strings: string[]) => getRandomValue(strings);
