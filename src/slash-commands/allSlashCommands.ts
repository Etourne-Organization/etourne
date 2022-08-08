import { Command } from './CommandStructure';

import hello from './commands/hello';
import createCustoms from './commands/createCustoms';

const allSlashCommands: Command[] = [hello, createCustoms];

export default allSlashCommands;
