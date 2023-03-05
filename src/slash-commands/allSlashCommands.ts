import { Command } from './CommandStructure';

import hello from './commands/hello';
import createEvent from './commands/createEvent';
import selectTimezone from './commands/selectTimezone';
import help from './commands/help';
import botInfo from './commands/botInfo';
import createTeamEvent from './commands/createTeamEvent/createTeamEvent';
import testAdd from './commands/testAdd';

const allSlashCommands: Command[] = [
	hello,
	createEvent,
	selectTimezone,
	help,
	botInfo,
	createTeamEvent,
	testAdd,
];

export default allSlashCommands;
