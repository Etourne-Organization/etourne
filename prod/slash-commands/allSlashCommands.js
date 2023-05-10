"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const createEvent_1 = tslib_1.__importDefault(require("./commands/createEvent/createEvent"));
const help_1 = tslib_1.__importDefault(require("./commands/help"));
const botInfo_1 = tslib_1.__importDefault(require("./commands/botInfo"));
const createTeamEvent_1 = tslib_1.__importDefault(require("./commands/createTeamEvent/createTeamEvent"));
const setUserRole_1 = tslib_1.__importDefault(require("./commands/setUserRole/setUserRole"));
const getStarted_1 = tslib_1.__importDefault(require("./commands/getStarted"));
const allSlashCommands = [
    createEvent_1.default,
    help_1.default,
    botInfo_1.default,
    createTeamEvent_1.default,
    setUserRole_1.default,
    getStarted_1.default,
];
exports.default = allSlashCommands;
