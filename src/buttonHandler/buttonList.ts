import { ButtonFunction } from './ButtonStructure';
import register from './buttonFunctions/normalEvent/register';
import unregister from './buttonFunctions/normalEvent/unregister';
import createTeam from './buttonFunctions/teamEvent/createTeam';
import registerTeamMember from './buttonFunctions/teamEvent/registerTeamMember';
import unregisterTeamMember from './buttonFunctions/teamEvent/unregisterTeamMember';
import deleteTeam from './buttonFunctions/teamEvent/deleteTeam';
import setTeamMemberNumLimit from './buttonFunctions/teamEvent/setTeamMemberNumLimit';
import setTeamNumLimit from './buttonFunctions/teamEvent/setTeamNumLimit';

const buttonList: ButtonFunction[] = [
	register,
	unregister,
	createTeam,
	registerTeamMember,
	unregisterTeamMember,
	deleteTeam,
	setTeamNumLimit,
	setTeamMemberNumLimit,
];

export default buttonList;
