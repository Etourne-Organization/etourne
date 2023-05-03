"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const teams_1 = require("../../../supabase/supabaseFunctions/teams");
const editTeamInfoModal = {
    customId: 'editTeamInfoModal',
    run: async (client, interaction) => {
        try {
            const teamId = interaction.message?.embeds[0].footer?.text.split(' ')[2];
            const eventId = interaction.message?.embeds[0].footer?.text.split(' ')[5];
            const registeredPlayers = interaction.message?.embeds[0].fields?.find((r) => r.name === 'Registered players');
            const eventDateTime = interaction.message?.embeds[0].fields?.find((r) => r.name.includes('Registered players'));
            const eventName = interaction.message?.embeds[0].fields?.find((r) => r.name === 'Event Name');
            const teamName = interaction.fields.getTextInputValue('teamName');
            const teamShortDescription = interaction.fields.getTextInputValue('teamShortDescription');
            const editedEmbed = new discord_js_1.MessageEmbed()
                .setColor('#3a9ce2')
                .setTitle(teamName)
                .setDescription(`>>> ${teamShortDescription}`)
                .addFields([
                {
                    name: 'Team Leader',
                    value: interaction.user.tag,
                },
                {
                    name: 'Event Name',
                    value: eventName.value,
                },
                {
                    name: 'Event Date and Time',
                    value: eventDateTime.value,
                },
                {
                    name: registeredPlayers.name,
                    value: registeredPlayers.value.length <= 0
                        ? ' '
                        : registeredPlayers.value,
                },
            ])
                .setFooter({
                text: `Team ID: ${teamId} Event ID: ${eventId}`,
            });
            if (!interaction.inCachedGuild())
                return;
            await (0, teams_1.updateTeam)({
                id: teamId,
                teamName: teamName,
                teamDescription: teamShortDescription,
            });
            return await interaction.update({
                embeds: [editedEmbed],
            });
        }
        catch (err) {
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in modalFunctions/teamEvent/editTeamInfoModal.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = editTeamInfoModal;
