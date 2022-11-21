"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const botInfo_1 = tslib_1.__importDefault(require("./commands/botInfo"));
const legacyCommands = { botinfo: botInfo_1.default };
exports.default = legacyCommands;
