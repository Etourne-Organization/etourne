"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const hello_1 = tslib_1.__importDefault(require("./commands/hello"));
const createEvent_1 = tslib_1.__importDefault(require("./commands/createEvent"));
const selectTimezone_1 = tslib_1.__importDefault(require("./commands/selectTimezone"));
const help_1 = tslib_1.__importDefault(require("./commands/help"));
const botInfo_1 = tslib_1.__importDefault(require("./commands/botInfo"));
const createTeamEvent_1 = tslib_1.__importDefault(require("./commands/createTeamEvent/createTeamEvent"));
const allSlashCommands = [
    hello_1.default,
    createEvent_1.default,
    selectTimezone_1.default,
    help_1.default,
    botInfo_1.default,
    createTeamEvent_1.default,
];
exports.default = allSlashCommands;
