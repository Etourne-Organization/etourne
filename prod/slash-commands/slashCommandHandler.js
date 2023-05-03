"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const allSlashCommands_1 = tslib_1.__importDefault(require("./allSlashCommands"));
exports.default = async (client, interaction) => {
    try {
        const slashCommand = allSlashCommands_1.default.find((c) => c.name === interaction.commandName);
        if (!slashCommand) {
            await interaction.reply({
                content: 'An error has occured [slash commands]',
            });
            return;
        }
        slashCommand.run(client, interaction);
    }
    catch (err) {
        try {
            fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in slashCommandHandler.ts \n Actual error: ${err} \n \n`, (err) => {
                if (err)
                    throw err;
            });
        }
        catch (err) {
            console.log('Error logging failed');
        }
    }
};
