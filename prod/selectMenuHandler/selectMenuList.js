"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const removeTeamPlayer_1 = tslib_1.__importDefault(require("./selectMenuFunctions/removeTeamPlayer/removeTeamPlayer"));
const removePlayer_1 = tslib_1.__importDefault(require("./selectMenuFunctions/removePlayer/removePlayer"));
const selectMenuList = [removeTeamPlayer_1.default, removePlayer_1.default];
exports.default = selectMenuList;
