import { Message, Client } from 'discord.js';

const PREFIX: any = process.env.PREFIX;

import legacyCommands, {
	legacyCommands as legacyCommandsInterface,
} from './commandsList';
import infoMessageEmbed from '../globalUtils/infoMessageEmbed';

const commands = (message: Message, client: Client) => {
	if (!message.author.bot && message.content.startsWith(PREFIX)) {
		const [CMD_NAME, ...args] = message.content
			.trim()
			.substring(PREFIX.length)
			.split(/\s+/); //this is a regular expression which eliminates multiple whitespaces in the command

		if (CMD_NAME in legacyCommands) {
			legacyCommands[CMD_NAME as keyof legacyCommandsInterface](
				message,
				CMD_NAME,
				args,
				client,
			);
		} else {
			message.channel.send({
				embeds: [infoMessageEmbed(':x: Wrong Command :x:')],
			});
		}
	}
};

export default commands;
