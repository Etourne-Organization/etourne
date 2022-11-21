"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const allSlashCommands_1 = tslib_1.__importDefault(require("./allSlashCommands"));
exports.default = async (client, interaction) => {
    try {
        const slashCommand = allSlashCommands_1.default.find((c) => c.name === interaction.commandName);
        if (!slashCommand) {
            await interaction.reply({ content: 'An error has occured' });
            return;
        }
        slashCommand.run(client, interaction);
    }
    catch (err) {
        console.log({
            actualError: err,
            message: 'Something went wrong in slashCommandHandler.ts',
        });
    }
};
