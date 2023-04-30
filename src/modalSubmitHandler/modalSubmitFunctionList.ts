import { ModalFunction } from './ModalSubmitStructure';

import teamModal from './modalSubmitFunctions/teamEvent/teamModal';
import teamEventModal from './modalSubmitFunctions/teamEvent/teamEventModal';
import normalEventModal from './modalSubmitFunctions/normalEvent/normalEventModal';
import setNumTeamLimitModal from './modalSubmitFunctions/teamEvent/setNumTeamLimitModal';
import setNumTeamMemberLimitModal from './modalSubmitFunctions/teamEvent/setNumTeamMemberLimitModal';
import editEventInfoModal from './modalSubmitFunctions/normalEvent/editEventInfoModal';
import editTeamEventInfoModal from './modalSubmitFunctions/teamEvent/editTeamEventInfoModal';
import editTeamInfoModal from './modalSubmitFunctions/teamEvent/editTeamInfoModal';
import setMaxNumPlayerModal from './modalSubmitFunctions/normalEvent/setMaxNumPlayerModal';

const modalSubmitFunctionList: ModalFunction[] = [
	teamModal,
	teamEventModal,
	normalEventModal,
	setNumTeamLimitModal,
	setNumTeamMemberLimitModal,
	editEventInfoModal,
	editTeamEventInfoModal,
	editTeamInfoModal,
	setMaxNumPlayerModal,
];

export default modalSubmitFunctionList;
