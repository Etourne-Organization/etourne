import { ButtonFunction } from './Button';
import register from './functions/normalEvent/register';
import unregister from './functions/normalEvent/unregister';
import createTeam from './functions/teamEvent/createTeam';
import registerTeamPlayer from './functions/teamEvent/registerTeamPlayer';
import unregisterTeamPlayer from './functions/teamEvent/unregisterTeamPlayer';
import deleteTeam from './functions/teamEvent/deleteTeam';
import setMaxNumTeamPlayers from './functions/teamEvent/setMaxNumTeamPlayers';
import setMaxNumTeams from './functions/teamEvent/setMaxNumTeams';
import deleteEvent from './functions/allEventButtonFunctions/deleteEvent';
import removeTeamPlayer from './functions/teamEvent/removeTeamPlayer';
import removePlayer from './functions/normalEvent/removePlayer';
import editEventInfo from './functions/normalEvent/editEventInfo';
import editTeamEventInfo from './functions/teamEvent/editTeamEventInfo';
import editTeamInfo from './functions/teamEvent/editTeamInfo';
import setMaxNumPlayers from './functions/normalEvent/setMaxNumPlayers';

const buttonList: ButtonFunction[] = [
	register,
	unregister,
	createTeam,
	registerTeamPlayer,
	unregisterTeamPlayer,
	deleteTeam,
	setMaxNumTeams,
	setMaxNumTeamPlayers,
	deleteEvent,
	removeTeamPlayer,
	removePlayer,
	editEventInfo,
	editTeamEventInfo,
	editTeamInfo,
	setMaxNumPlayers,
];

export default buttonList;
