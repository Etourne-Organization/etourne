"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const events_1 = require("../../../supabase/supabaseFunctions/events");
const setMaxNumPlayers = {
    customId: 'setMaxNumPlayers',
    run: async (client, interaction) => {
        try {
            const eventId = interaction.message.embeds[0].footer?.text.split(': ')[1];
            const maxNumPlayers = await (0, events_1.getColumnValueById)({
                id: eventId,
                columnName: 'maxNumPlayers',
            });
            const modal = new discord_js_1.Modal()
                .setCustomId(`maxNumPlayersModalSubmit-${interaction.id}`)
                .setTitle('Create Team');
            const input = new discord_js_1.TextInputComponent()
                .setCustomId('maxNumPlayersInput')
                .setLabel('Num of team member limit')
                .setStyle('SHORT')
                .setPlaceholder('Enter limit for num of team members in each team')
                .setValue(maxNumPlayers[0]['maxNumPlayers']
                ? maxNumPlayers[0]['maxNumPlayers'].toString()
                : '');
            const teamMemberLimitNumActionRow = new discord_js_1.MessageActionRow().addComponents(input);
            modal.addComponents(teamMemberLimitNumActionRow);
            await interaction.showModal(modal);
        }
        catch (err) {
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in buttonFunctions/normalEvent/setMaxNumPlayers.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = setMaxNumPlayers;
