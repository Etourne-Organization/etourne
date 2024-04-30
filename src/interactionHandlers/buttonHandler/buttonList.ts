import { ButtonFunction } from "./type";
import register from "./handlers/normalEvent/register";
import unregister from "./handlers/normalEvent/unregister";
import createTeam from "./handlers/teamEvent/createTeam";
import registerTeamPlayer from "./handlers/teamEvent/registerTeamPlayer";
import unregisterTeamPlayer from "./handlers/teamEvent/unregisterTeamPlayer";
import deleteTeam from "./handlers/teamEvent/deleteTeam";
import setMaxNumTeamPlayers from "./handlers/teamEvent/setMaxNumTeamPlayers";
import setMaxNumTeams from "./handlers/teamEvent/setMaxNumTeams";
import deleteEvent from "./handlers/normalEvent/deleteEvent";
import removeTeamPlayer from "./handlers/teamEvent/removeTeamPlayer";
import removePlayer from "./handlers/normalEvent/removePlayer";
import editEventInfo from "./handlers/normalEvent/editEventInfo";
import editTeamEventInfo from "./handlers/teamEvent/editTeamEventInfo";
import editTeamInfo from "./handlers/teamEvent/editTeamInfo";
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
