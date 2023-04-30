import { ModalFunction } from './ModalSubmitStructure';

import teamModal from './modalSubmitFunctions/teamEvent/teamModal';
import teamEventModal from './modalSubmitFunctions/teamEvent/teamEventModal';
import normalEventModal from './modalSubmitFunctions/normalEvent/normalEventModal';
import setMaxNumTeamsModal from './modalSubmitFunctions/teamEvent/setMaxNumTeamsModal';
import setMaxNumTeamPlayersModal from './modalSubmitFunctions/teamEvent/setMaxNumTeamPlayersModal';
import editEventInfoModal from './modalSubmitFunctions/normalEvent/editEventInfoModal';
import editTeamEventInfoModal from './modalSubmitFunctions/teamEvent/editTeamEventInfoModal';
import editTeamInfoModal from './modalSubmitFunctions/teamEvent/editTeamInfoModal';
import setMaxNumPlayersModal from './modalSubmitFunctions/normalEvent/setMaxNumPlayersModal';

const modalSubmitFunctionList: ModalFunction[] = [
	teamModal,
	teamEventModal,
	normalEventModal,
	setMaxNumTeamsModal,
	setMaxNumTeamPlayersModal,
	editEventInfoModal,
	editTeamEventInfoModal,
	editTeamInfoModal,
	setMaxNumPlayersModal,
];

export default modalSubmitFunctionList;
