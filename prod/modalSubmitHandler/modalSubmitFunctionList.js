"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const teamModal_1 = tslib_1.__importDefault(require("./modalSubmitFunctions/teamEvent/teamModal"));
const teamEventModal_1 = tslib_1.__importDefault(require("./modalSubmitFunctions/teamEvent/teamEventModal"));
const normalEventModal_1 = tslib_1.__importDefault(require("./modalSubmitFunctions/normalEvent/normalEventModal"));
const setMaxNumTeamsModal_1 = tslib_1.__importDefault(require("./modalSubmitFunctions/teamEvent/setMaxNumTeamsModal"));
const setMaxNumTeamPlayersModal_1 = tslib_1.__importDefault(require("./modalSubmitFunctions/teamEvent/setMaxNumTeamPlayersModal"));
const editEventInfoModal_1 = tslib_1.__importDefault(require("./modalSubmitFunctions/normalEvent/editEventInfoModal"));
const editTeamEventInfoModal_1 = tslib_1.__importDefault(require("./modalSubmitFunctions/teamEvent/editTeamEventInfoModal"));
const editTeamInfoModal_1 = tslib_1.__importDefault(require("./modalSubmitFunctions/teamEvent/editTeamInfoModal"));
const setMaxNumPlayersModal_1 = tslib_1.__importDefault(require("./modalSubmitFunctions/normalEvent/setMaxNumPlayersModal"));
const modalSubmitFunctionList = [
    teamModal_1.default,
    teamEventModal_1.default,
    normalEventModal_1.default,
    setMaxNumTeamsModal_1.default,
    setMaxNumTeamPlayersModal_1.default,
    editEventInfoModal_1.default,
    editTeamEventInfoModal_1.default,
    editTeamInfoModal_1.default,
    setMaxNumPlayersModal_1.default,
];
exports.default = modalSubmitFunctionList;
