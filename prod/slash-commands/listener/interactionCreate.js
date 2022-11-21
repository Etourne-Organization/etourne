"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const slashCommandHandler_1 = tslib_1.__importDefault(require("../slashCommandHandler"));
exports.default = (client) => {
    client.on('interactionCreate', async (interaction) => {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            await (0, slashCommandHandler_1.default)(client, interaction);
        }
    });
};
