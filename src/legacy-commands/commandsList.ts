import { Client, Message } from 'discord.js';

import botInfo from './commands/botInfo';

export interface legacyCommands {
	botinfo: (
		message: Message,
		CMD_NAME: string,
		args: [] | any,
		client: Client,
	) => void;
}

const legacyCommands: legacyCommands = { botinfo: botInfo };

export default legacyCommands;
