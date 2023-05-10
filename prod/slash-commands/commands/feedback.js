"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const infoMessageEmbed_1 = tslib_1.__importDefault(require("../../globalUtils/infoMessageEmbed"));
const feedback = {
    name: 'feedback',
    description: 'Send feedback',
    run: async (client, interaction) => {
        try {
            return await interaction.reply({
                embeds: [
                    (0, infoMessageEmbed_1.default)('DM mz10ah#0054 to share feedback or ask questions.'),
                ],
            });
        }
        catch (err) {
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in slashcommands/feedback.ts \n Actual error: ${err} \n \n`, (err) => {
                    if (err)
                        throw err;
                });
            }
            catch (err) {
                console.log('Error logging failed');
            }
        }
    },
};
exports.default = feedback;
