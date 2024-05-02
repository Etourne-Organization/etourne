import { ModalSubmit } from "./type";

import editEventInfoModal from "./handlers/normalEvent/editModal";
import normalEventModal from "./handlers/normalEvent/createModal";
import setMaxNumPlayersModal from "./handlers/normalEvent/setMaxNumPlayers";
import teamEventModal from "./handlers/teamEvent/teamCreator/createModal";
import editTeamEventInfoModal from "./handlers/teamEvent/teamCreator/editModal";
import editTeamInfoModal from "./handlers/teamEvent/team/editModal";
import setMaxNumTeamPlayersModal from "./handlers/teamEvent/teamCreator/setMaxTeamPlayers";
import setMaxNumTeamsModal from "./handlers/teamEvent/teamCreator/setMaxNumTeams";
import teamModal from "./handlers/teamEvent/team/createModal";

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
