import { ModalFunction } from './ModalSubmitStructure';

import teamModal from './modalSubmitFunctions/teamEvent/teamModal';
import teamEventModal from './modalSubmitFunctions/teamEvent/teamEventModal';
import normalEventModal from './modalSubmitFunctions/normalEvent/normalEventModal';
import setNumTeamLimitModal from './modalSubmitFunctions/teamEvent/setNumTeamLimitModal';
import setNumTeamMemberLimitModal from './modalSubmitFunctions/teamEvent/setNumTeamMemberLimitModal';

const modalSubmitFunctionList: ModalFunction[] = [
	teamModal,
	teamEventModal,
	normalEventModal,
	setNumTeamLimitModal,
	setNumTeamMemberLimitModal,
];

export default modalSubmitFunctionList;
