import { ButtonFunction } from './ButtonStructure';
import register from './buttonFunctions/normalEvent/register';
import unregister from './buttonFunctions/normalEvent/unregister';
import createTeam from './buttonFunctions/teamEvent/createTeam';
import registerTeamPlayer from './buttonFunctions/teamEvent/registerTeamPlayer';
import unregisterTeamPlayer from './buttonFunctions/teamEvent/unregisterTeamPlayer';
import deleteTeam from './buttonFunctions/teamEvent/deleteTeam';
import setMaxNumTeamPlayers from './buttonFunctions/teamEvent/setMaxNumTeamPlayers';
import setMaxNumTeams from './buttonFunctions/teamEvent/setMaxNumTeams';
import deleteEvent from './buttonFunctions/allEventButtonFunctions/deleteEvent';
import removeTeamPlayer from './buttonFunctions/teamEvent/removeTeamPlayer';
import removePlayer from './buttonFunctions/normalEvent/removePlayer';
import editEventInfo from './buttonFunctions/normalEvent/editEventInfo';
import editTeamEventInfo from './buttonFunctions/teamEvent/editTeamEventInfo';
import editTeamInfo from './buttonFunctions/teamEvent/editTeamInfo';
import setMaxNumPlayers from './buttonFunctions/normalEvent/setMaxNumPlayers';

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
