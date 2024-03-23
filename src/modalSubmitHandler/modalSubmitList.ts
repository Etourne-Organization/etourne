import { ModalSubmit } from './ModalSubmit';

import teamModal from './functions/teamEvent/teamModal';
import teamEventModal from './functions/teamEvent/teamEventModal';
import normalEventModal from './functions/normalEvent/normalEventModal';
import setMaxNumTeamsModal from './functions/teamEvent/setMaxNumTeamsModal';
import setMaxNumTeamPlayersModal from './functions/teamEvent/setMaxNumTeamPlayersModal';
import editEventInfoModal from './functions/normalEvent/editEventInfoModal';
import editTeamEventInfoModal from './functions/teamEvent/editTeamEventInfoModal';
import editTeamInfoModal from './functions/teamEvent/editTeamInfoModal';
import setMaxNumPlayersModal from './functions/normalEvent/setMaxNumPlayersModal';

const modalSubmitFunctionList: ModalSubmit[] = [
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
