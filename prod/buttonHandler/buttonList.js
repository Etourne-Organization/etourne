"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const register_1 = tslib_1.__importDefault(require("./buttonFunctions/normalEvent/register"));
const unregister_1 = tslib_1.__importDefault(require("./buttonFunctions/normalEvent/unregister"));
const createTeam_1 = tslib_1.__importDefault(require("./buttonFunctions/teamEvent/createTeam"));
const registerTeamPlayer_1 = tslib_1.__importDefault(require("./buttonFunctions/teamEvent/registerTeamPlayer"));
const unregisterTeamPlayer_1 = tslib_1.__importDefault(require("./buttonFunctions/teamEvent/unregisterTeamPlayer"));
const deleteTeam_1 = tslib_1.__importDefault(require("./buttonFunctions/teamEvent/deleteTeam"));
const setMaxNumTeamPlayers_1 = tslib_1.__importDefault(require("./buttonFunctions/teamEvent/setMaxNumTeamPlayers"));
const setMaxNumTeams_1 = tslib_1.__importDefault(require("./buttonFunctions/teamEvent/setMaxNumTeams"));
const deleteEvent_1 = tslib_1.__importDefault(require("./buttonFunctions/allEventButtonFunctions/deleteEvent"));
const removeTeamPlayer_1 = tslib_1.__importDefault(require("./buttonFunctions/teamEvent/removeTeamPlayer"));
const removePlayer_1 = tslib_1.__importDefault(require("./buttonFunctions/normalEvent/removePlayer"));
const editEventInfo_1 = tslib_1.__importDefault(require("./buttonFunctions/normalEvent/editEventInfo"));
const editTeamEventInfo_1 = tslib_1.__importDefault(require("./buttonFunctions/teamEvent/editTeamEventInfo"));
const editTeamInfo_1 = tslib_1.__importDefault(require("./buttonFunctions/teamEvent/editTeamInfo"));
const setMaxNumPlayers_1 = tslib_1.__importDefault(require("./buttonFunctions/normalEvent/setMaxNumPlayers"));
const buttonList = [
    register_1.default,
    unregister_1.default,
    createTeam_1.default,
    registerTeamPlayer_1.default,
    unregisterTeamPlayer_1.default,
    deleteTeam_1.default,
    setMaxNumTeams_1.default,
    setMaxNumTeamPlayers_1.default,
    deleteEvent_1.default,
    removeTeamPlayer_1.default,
    removePlayer_1.default,
    editEventInfo_1.default,
    editTeamEventInfo_1.default,
    editTeamInfo_1.default,
    setMaxNumPlayers_1.default,
];
exports.default = buttonList;
