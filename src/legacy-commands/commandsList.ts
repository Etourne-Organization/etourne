import botInfo from './commands/botInfo';

export interface legacyCommands {
	botinfo: Function;
}

const legacyCommands: legacyCommands = { botinfo: botInfo };

export default legacyCommands;
