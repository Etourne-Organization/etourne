"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const events_1 = require("../../../supabase/supabaseFunctions/events");
const updateAllTeamInfo_1 = tslib_1.__importDefault(require("./utils/updateAllTeamInfo"));
const setMaxNumTeamPlayersModal = {
    customId: 'setMaxNumTeamPlayersModalSubmit',
    run: async (client, interaction) => {
        try {
            const eventId = interaction.message?.embeds[0].footer?.text.split(': ')[1];
            const maxNumTeamPlayers = interaction.fields.getTextInputValue('maxNumTeamPlayers');
            (0, events_1.setColumnValue)({
                data: [
                    {
                        key: 'maxNumTeamPlayers',
                        value: parseInt(maxNumTeamPlayers),
                        id: parseInt(eventId),
                    },
                ],
            });
            interaction.message?.embeds[0].fields?.find((r) => {
                if (r.name === 'Max num of team players') {
                    r.value = maxNumTeamPlayers;
                }
            });
            const editedEmbed = new discord_js_1.MessageEmbed()
                .setColor('#3a9ce2')
                .setTitle(interaction.message?.embeds[0].title || 'Undefined')
                .setDescription(interaction.message?.embeds[0].description || 'Undefined')
                .addFields(interaction.message?.embeds[0].fields || [])
                .setFooter({ text: `Event ID: ${eventId}` });
            (0, updateAllTeamInfo_1.default)({ eventId: eventId, interaction: interaction });
            return await interaction.update({ embeds: [editedEmbed] });
        }
        catch (err) {
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in modalFunctions/teamEvent/teamMemberNumLimitModalSubmit.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = setMaxNumTeamPlayersModal;
