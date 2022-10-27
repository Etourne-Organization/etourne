import { Command } from './CommandStructure';

import hello from './commands/hello';
import createCustoms from './commands/createCustoms';
import selectTimezone from './commands/selectTimezone';

const allSlashCommands: Command[] = [hello, createCustoms, selectTimezone];

export default allSlashCommands;
