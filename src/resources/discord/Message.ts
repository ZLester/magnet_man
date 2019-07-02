import { Collection, Message, MessageAttachment } from 'discord.js';

import { isTextChannel } from './Channel';

export const isFromTargetChannel = (message: Message, targetChannel: string) =>
    isTextChannel(message.channel) && message.channel.name === targetChannel;

export const isFromBot = (message: Message, botId: string) =>
    message.author.id === botId;

const VALID_IMAGE_EXTENSIONS = new Set([
    'jpg',
    'jpeg',
    'png',
    'gif',
]);

export const hasValidImage = (message: Message) =>
    message.attachments.size > 0 &&
    [ ...message.attachments ].some(([ id, attachment ]) => {
        const parts = attachment.url.split('.');
        const extension = parts[parts.length - 1];
        return VALID_IMAGE_EXTENSIONS.has(extension);
    });
