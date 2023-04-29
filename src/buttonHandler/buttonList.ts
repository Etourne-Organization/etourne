import { ButtonFunction } from './ButtonStructure';
import register from './buttonFunctions/normalEvent/register';
import unregister from './buttonFunctions/normalEvent/unregister';
import createTeam from './buttonFunctions/teamEvent/createTeam';
import registerTeamMember from './buttonFunctions/teamEvent/registerTeamMember';
import unregisterTeamMember from './buttonFunctions/teamEvent/unregisterTeamMember';
import deleteTeam from './buttonFunctions/teamEvent/deleteTeam';
import setNumTeamMemberLimit from './buttonFunctions/teamEvent/setNumTeamMemberLimit';
import setNumTeamLimit from './buttonFunctions/teamEvent/setNumTeamLimit';
import deleteEvent from './buttonFunctions/allEventButtonFunctions/deleteEvent';
import removeTeamPlayer from './buttonFunctions/teamEvent/removeTeamPlayer';
import removePlayer from './buttonFunctions/normalEvent/removePlayer';
import editEventInfo from './buttonFunctions/normalEvent/editEventInfo';
import editTeamEventInfo from './buttonFunctions/teamEvent/editTeamEventInfo';
import editTeamInfo from './buttonFunctions/teamEvent/editTeamInfo';
import setMaxNumPlayer from './buttonFunctions/normalEvent/setMaxNumPlayer';

const buttonList: ButtonFunction[] = [
	register,
	unregister,
	createTeam,
	registerTeamMember,
	unregisterTeamMember,
	deleteTeam,
	setNumTeamLimit,
	setNumTeamMemberLimit,
	deleteEvent,
	removeTeamPlayer,
	removePlayer,
	editEventInfo,
	editTeamEventInfo,
	editTeamInfo,
	setMaxNumPlayer,
];

export default buttonList;
