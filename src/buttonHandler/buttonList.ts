import { ButtonFunction } from './ButtonStructure';
import register from './buttonFunctions/normalEvent/register';
import unregister from './buttonFunctions/normalEvent/unregister';
import createTeam from './buttonFunctions/teamEvent/createTeam';

const buttonList: ButtonFunction[] = [register, unregister, createTeam];

export default buttonList;
