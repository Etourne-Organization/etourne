"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const events_1 = require("../../../supabase/supabaseFunctions/events");
const setMaxNumTeamPlayers = {
    customId: 'setMaxNumTeamPlayers',
    run: async (client, interaction) => {
        try {
            const eventId = interaction.message?.embeds[0].footer?.text.split(': ')[1];
            const maxNumTeamPlayers = await (0, events_1.getColumnValueById)({
                id: eventId,
                columnName: 'maxNumTeamPlayers',
            });
            const modal = new discord_js_1.Modal()
                .setCustomId(`setMaxNumTeamPlayersModalSubmit-${interaction.id}`)
                .setTitle('Create Team');
            const maxNumTeamPlayersInput = new discord_js_1.TextInputComponent()
                .setCustomId('maxNumTeamPlayers')
                .setLabel('Max num of team players')
                .setStyle('SHORT')
                .setPlaceholder('Enter max num of team players in each team')
                .setValue(maxNumTeamPlayers[0]['maxNumTeamPlayers']
                ? maxNumTeamPlayers[0]['maxNumTeamPlayers'].toString()
                : '');
            const maxNumTeamPlayersActionRow = new discord_js_1.MessageActionRow().addComponents(maxNumTeamPlayersInput);
            modal.addComponents(maxNumTeamPlayersActionRow);
            await interaction.showModal(modal);
        }
        catch (err) {
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in buttonFunctions/teamEvent/setTeamMemberNumLimit.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = setMaxNumTeamPlayers;
