import { Command } from "./type";

// import createEventOld from './commands/createEventOld';
import createEvent from "./commands/createEvent";
import help from "./commands/help";
import botInfo from "./commands/botInfo";
// import createTeamEvent from './commands/createTeamEvent';
import setUserRole from "./commands/setUserRole";
import getStarted from "./commands/getStarted";
import feedback from "./commands/feedback";
import listServerEvents from "./commands/listServerEvents";
import getEvent from "./commands/getEvent";
import registerServer from "./commands/registerServer";
import requestSupport from "./commands/requestSupport";
import registerAdmin from "./commands/registerAdmin";

const slashCommandsList: Command[] = [
  createEvent,
  help,
  botInfo,
  setUserRole,
  getStarted,
  feedback,
  listServerEvents,
  getEvent,
  registerServer,
  requestSupport,
  registerAdmin,
  // createEventOld,
  // createTeamEvent,
];

export default slashCommandsList;
