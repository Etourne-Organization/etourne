import { ModalFunction } from './ModalSubmitStructure';

import teamModal from './modalSubmitFunctions/teamEvent/teamModal';
import teamEventModal from './modalSubmitFunctions/teamEvent/teamEventModal';
import normalEventModal from './modalSubmitFunctions/normalEvent/normalEventModal';

const modalSubmitFunctionList: ModalFunction[] = [
	teamModal,
	teamEventModal,
	normalEventModal,
];

export default modalSubmitFunctionList;
