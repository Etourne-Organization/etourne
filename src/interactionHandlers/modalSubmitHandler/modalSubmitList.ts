import { ModalSubmit } from "./type";

import editEventInfoModal from "./handlers/normalEvent/editEventInfoModal";
import normalEventModal from "./handlers/normalEvent/normalEventModal";
import setMaxNumPlayersModal from "./handlers/normalEvent/setMaxNumPlayersModal";
import editTeamEventInfoModal from "./handlers/teamEvent/editTeamEventInfoModal";
import editTeamInfoModal from "./handlers/teamEvent/editTeamInfoModal";
import setMaxNumTeamPlayersModal from "./handlers/teamEvent/setMaxNumTeamPlayersModal";
import setMaxNumTeamsModal from "./handlers/teamEvent/setMaxNumTeamsModal";
import teamEventModal from "./handlers/teamEvent/teamEventModal";
import teamModal from "./handlers/teamEvent/teamModal";

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
