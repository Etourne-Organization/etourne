import { ButtonFunction } from "./type";
import register from "./handlers/normalEvent/register";
import unregister from "./handlers/normalEvent/unregister";
import createTeam from "./handlers/teamEvent/teamCreator/createTeam";
import registerTeamPlayer from "./handlers/teamEvent/team/registerTeamPlayer";
import unregisterTeamPlayer from "./handlers/teamEvent/team/unregisterTeamPlayer";
import deleteTeam from "./handlers/teamEvent/team/deleteTeam";
import setMaxNumTeamPlayers from "./handlers/teamEvent/teamCreator/setMaxNumTeamPlayers";
import setMaxNumTeams from "./handlers/teamEvent/teamCreator/setMaxNumTeams";
import deleteEvent from "./handlers/normalEvent/deleteEvent";
import removeTeamPlayer from "./handlers/teamEvent/team/removeTeamPlayer";
import removePlayer from "./handlers/normalEvent/removePlayer";
import editEventInfo from "./handlers/normalEvent/editEventInfo";
import editTeamEventInfo from "./handlers/teamEvent/teamCreator/editTeamEventInfo";
import editTeamInfo from "./handlers/teamEvent/team/editTeamInfo";
import setMaxNumPlayers from "./handlers/normalEvent/setMaxNumPlayers";

const buttonList: ButtonFunction[] = [
  register,
  unregister,
  createTeam,
  registerTeamPlayer,
  unregisterTeamPlayer,
  deleteTeam,
  setMaxNumTeams,
  setMaxNumTeamPlayers,
  deleteEvent,
  removeTeamPlayer,
  removePlayer,
  editEventInfo,
  editTeamEventInfo,
  editTeamInfo,
  setMaxNumPlayers,
];

export default buttonList;
