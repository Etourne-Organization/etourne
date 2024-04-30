import { SelectMenu } from './type';

import removeTeamPlayer from './handlers/removeTeamPlayer';
import removePlayer from './handlers/removePlayer';
import createEvent from './handlers/selectEventType';

const selectMenuList: SelectMenu[] = [
	removeTeamPlayer,
	removePlayer,
	createEvent,
];

export default selectMenuList;
