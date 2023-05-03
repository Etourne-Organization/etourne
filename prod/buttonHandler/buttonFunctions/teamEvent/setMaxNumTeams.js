"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const events_1 = require("../../../supabase/supabaseFunctions/events");
const setMaxNumTeams = {
    customId: 'setMaxNumTeams',
    run: async (client, interaction) => {
        try {
            const eventId = interaction.message?.embeds[0].footer?.text.split(': ')[1];
            const maxNumTeams = await (0, events_1.getColumnValueById)({
                id: eventId,
                columnName: 'maxNumTeams',
            });
            const modal = new discord_js_1.Modal()
                .setCustomId(`setMaxNumTeamsModalSubmit-${interaction.id}`)
                .setTitle('Create Team');
            const maxNumTeamsInput = new discord_js_1.TextInputComponent()
                .setCustomId('maxNumTeams')
                .setLabel('Max num of teams')
                .setStyle('SHORT')
                .setPlaceholder('Enter max num of teams')
                .setValue(maxNumTeams[0]['maxNumTeams']
                ? maxNumTeams[0]['maxNumTeams'].toString()
                : '');
            const maxNumTeamsLimitActionRow = new discord_js_1.MessageActionRow().addComponents(maxNumTeamsInput);
            modal.addComponents(maxNumTeamsLimitActionRow);
            await interaction.showModal(modal);
        }
        catch (err) {
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in buttonFunctions/teamEvent/setTeamNumLimit.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = setMaxNumTeams;
