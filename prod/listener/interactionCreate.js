"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const slashCommandHandler_1 = tslib_1.__importDefault(require("../slash-commands/slashCommandHandler"));
const buttonHandler_1 = tslib_1.__importDefault(require("../buttonHandler/buttonHandler"));
const modalSubmitHandler_1 = tslib_1.__importDefault(require("../modalSubmitHandler/modalSubmitHandler"));
const index_1 = tslib_1.__importDefault(require("../selectMenuHandler/index"));
exports.default = (client) => {
    client.on('interactionCreate', async (interaction) => {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            await (0, slashCommandHandler_1.default)(client, interaction);
        }
        if (interaction.isButton()) {
            await (0, buttonHandler_1.default)(client, interaction);
        }
        if (interaction.isModalSubmit()) {
            await (0, modalSubmitHandler_1.default)(client, interaction);
        }
        if (interaction.isSelectMenu()) {
            await (0, index_1.default)(client, interaction);
        }
    });
};
