import { ModalFunction } from './ModalSubmitStructure';

import teamModal from './modalSubmitFunctions/teamEvent/teamModal';
import teamEventModal from './modalSubmitFunctions/teamEvent/teamEventModal';
import normalEventModal from './modalSubmitFunctions/normalEvent/normalEventModal';
import setTeamNumLimitModal from './modalSubmitFunctions/teamEvent/teamNumLimitModalSubmit';

const modalSubmitFunctionList: ModalFunction[] = [
	teamModal,
	teamEventModal,
	normalEventModal,
	setTeamNumLimitModal,
];

export default modalSubmitFunctionList;
