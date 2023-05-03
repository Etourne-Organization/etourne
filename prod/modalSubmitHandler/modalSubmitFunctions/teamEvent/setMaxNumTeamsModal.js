"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const events_1 = require("../../../supabase/supabaseFunctions/events");
const teams_1 = require("../../../supabase/supabaseFunctions/teams");
const setMaxNumTeamsModal = {
    customId: 'setMaxNumTeamsModalSubmit',
    run: async (client, interaction) => {
        try {
            const eventId = interaction.message?.embeds[0].footer?.text.split(': ')[1];
            const maxNumTeams = interaction.fields.getTextInputValue('maxNumTeams');
            const numOfTeams = await (0, teams_1.getNumOfTeams)({ eventId: eventId });
            if (numOfTeams > parseInt(maxNumTeams)) {
                const replyEmbed = new discord_js_1.MessageEmbed()
                    .setColor('#D83C3E')
                    .setTitle(':x: Number of registered teams is more than the new limit')
                    .setDescription('Decrease the number of registered teams to set a lower limit than the present value')
                    .setTimestamp();
                return await interaction.reply({
                    embeds: [replyEmbed],
                    ephemeral: true,
                });
            }
            (0, events_1.setColumnValue)({
                data: [
                    {
                        key: 'maxNumTeams',
                        value: parseInt(maxNumTeams),
                        id: parseInt(eventId),
                    },
                ],
            });
            interaction.message?.embeds[0].fields?.find((r) => {
                if (r.name === 'Max num of teams') {
                    r.value = maxNumTeams;
                }
            });
            const editedEmbed = new discord_js_1.MessageEmbed()
                .setColor('#3a9ce2')
                .setTitle(interaction.message?.embeds[0].title || 'Undefined')
                .setDescription(interaction.message?.embeds[0].description || 'Undefined')
                .addFields(interaction.message?.embeds[0].fields || [])
                .setFooter({ text: `Event ID: ${eventId}` });
            return await interaction.update({ embeds: [editedEmbed] });
        }
        catch (err) {
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in modalFunctions/teamEvent/teamNumLimitModalSubmit.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = setMaxNumTeamsModal;
