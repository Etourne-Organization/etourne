"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const PREFIX = process.env.PREFIX;
const commandsList_1 = tslib_1.__importDefault(require("./commandsList"));
const infoMessageEmbed_1 = tslib_1.__importDefault(require("../globalUtils/infoMessageEmbed"));
const commands = (message, client) => {
    if (!message.author.bot && message.content.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = message.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);
        if (CMD_NAME in commandsList_1.default) {
            commandsList_1.default[CMD_NAME](message, CMD_NAME, args, client);
        }
        else {
            message.channel.send({
                embeds: [(0, infoMessageEmbed_1.default)(':x: Wrong Command :x:')],
            });
        }
    }
};
exports.default = commands;
