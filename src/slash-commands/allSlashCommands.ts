import { Command } from './CommandStructure';

import hello from './commands/hello';
import createEvent from './commands/createEvent/createEvent';
import selectTimezone from './commands/selectTimezone';
import help from './commands/help';
import botInfo from './commands/botInfo';
import createTeamEvent from './commands/createTeamEvent/createTeamEvent';
import testAdd from './commands/testAdd';
import setUserRole from './commands/setUserRole/setUserRole';

const allSlashCommands: Command[] = [
	hello,
	createEvent,
	selectTimezone,
	help,
	botInfo,
	createTeamEvent,
	testAdd,
	setUserRole,
];

export default allSlashCommands;
