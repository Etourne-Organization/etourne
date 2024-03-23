import { SelectMenu } from './SelectMenu';

import removeTeamPlayer from './functions/removeTeamPlayer/removeTeamPlayer';
import removePlayer from './functions/removePlayer/removePlayer';

const selectMenuList: SelectMenu[] = [removeTeamPlayer, removePlayer];

export default selectMenuList;
