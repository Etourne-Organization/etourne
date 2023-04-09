import { ButtonFunction } from './ButtonStructure';
import register from './buttonFunctions/normalEvent/register';
import unregister from './buttonFunctions/normalEvent/unregister';
import createTeam from './buttonFunctions/teamEvent/createTeam';
import registerTeamMember from './buttonFunctions/teamEvent/registerTeamMember';
import unregisterTeamMember from './buttonFunctions/teamEvent/unregisterTeamMember';
import deleteTeam from './buttonFunctions/teamEvent/deleteTeam';
import setNumTeamMemberLimit from './buttonFunctions/teamEvent/setNumTeamMemberLimit';
import setNumTeamLimit from './buttonFunctions/teamEvent/setNumTeamLimit';

const buttonList: ButtonFunction[] = [
	register,
	unregister,
	createTeam,
	registerTeamMember,
	unregisterTeamMember,
	deleteTeam,
	setNumTeamLimit,
	setNumTeamMemberLimit,
];

export default buttonList;
