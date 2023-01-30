import { ButtonFunction } from './ButtonStructure';

import register from './buttonFunctions/normalEvent/register';
import unregister from './buttonFunctions/normalEvent/unregister';

const buttonList: ButtonFunction[] = [register, unregister];

export default buttonList;
