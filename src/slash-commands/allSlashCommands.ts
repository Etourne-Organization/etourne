import { Command } from './CommandStructure';

import createEvent from './commands/createEvent/createEvent';
// import selectTimezone from './commands/selectTimezone';
import help from './commands/help';
import botInfo from './commands/botInfo';
import createTeamEvent from './commands/createTeamEvent/createTeamEvent';
import setUserRole from './commands/setUserRole/setUserRole';
import getStarted from './commands/getStarted';
import feedback from './commands/feedback';
import listServerEvents from './commands/listServerEvents';
import getEvent from './commands/getEvent';
import registerServer from './commands/registerServer';
import requestSupport from './commands/requestSupport';
import registerAdmin from './commands/registerAdmin';

const allSlashCommands: Command[] = [
	createEvent,
	// selectTimezone,
	help,
	botInfo,
	createTeamEvent,
	setUserRole,
	getStarted,
	feedback,
	listServerEvents,
	getEvent,
	registerServer,
	requestSupport,
	registerAdmin,
];

export default allSlashCommands;
