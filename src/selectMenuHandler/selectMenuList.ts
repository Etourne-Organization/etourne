import { SelectMenu } from './SelectMenu';

import removeTeamPlayer from './selectMenuFunctions/removeTeamPlayer/removeTeamPlayer';
import removePlayer from './selectMenuFunctions/removePlayer/removePlayer';

const selectMenuList: SelectMenu[] = [removeTeamPlayer, removePlayer];

export default selectMenuList;
