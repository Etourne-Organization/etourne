import { SelectMenu } from './SelectMenu';

import removeTeamPlayer from './functions/removeTeamPlayer';
import removePlayer from './functions/removePlayer';
import createEvent from './functions/selectEventType';

const selectMenuList: SelectMenu[] = [
	removeTeamPlayer,
	removePlayer,
	createEvent,
];

export default selectMenuList;
