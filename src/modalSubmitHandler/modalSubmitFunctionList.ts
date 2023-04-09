import { ModalFunction } from './ModalSubmitStructure';

import teamModal from './modalSubmitFunctions/teamEvent/teamModal';
import teamEventModal from './modalSubmitFunctions/teamEvent/teamEventModal';
import normalEventModal from './modalSubmitFunctions/normalEvent/normalEventModal';
import setNumTeamLimitModal from './modalSubmitFunctions/teamEvent/setNumTeamLimitModal';
import setTeamMemberNumLimitModal from './modalSubmitFunctions/teamEvent/teamMemberNumLimitModalSubmit';

const modalSubmitFunctionList: ModalFunction[] = [
	teamModal,
	teamEventModal,
	normalEventModal,
	setNumTeamLimitModal,
	setTeamMemberNumLimitModal,
];

export default modalSubmitFunctionList;
