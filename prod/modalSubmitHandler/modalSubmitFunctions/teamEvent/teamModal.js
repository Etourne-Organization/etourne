"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const infoMessageEmbed_1 = tslib_1.__importDefault(require("../../../globalUtils/infoMessageEmbed"));
const teams_1 = require("../../../supabase/supabaseFunctions/teams");
const events_1 = require("../../../supabase/supabaseFunctions/events");
const teamModal = {
    customId: 'teamModalSubmit',
    run: async (client, interaction) => {
        try {
            const eventId = interaction.message?.embeds[0].footer?.text.split(': ')[1];
            const maxNumTeamPlayers = await (0, events_1.getColumnValueById)({
                id: eventId,
                columnName: 'maxNumTeamPlayers',
            });
            const eventName = interaction.message?.embeds[0].title;
            const eventDateTime = interaction.message?.embeds[0].fields?.find((r) => r.name === 'Event date & time')?.value;
            const teamName = interaction.fields.getTextInputValue('teamName');
            const teamShortDescription = interaction.fields.getTextInputValue('teamShortDescription');
            const buttons = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                .setCustomId('registerTeamPlayer')
                .setLabel('Register')
                .setStyle('PRIMARY'), new discord_js_1.MessageButton()
                .setCustomId('unregisterTeamPlayer')
                .setLabel('Unregister')
                .setStyle('DANGER'));
            const manageTeamPlayersButtons = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                .setCustomId('removeTeamPlayer')
                .setLabel('❌  Remove team player')
                .setStyle('SECONDARY'));
            const manageTeamButtons = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                .setCustomId('editTeamInfo')
                .setLabel('⚙️  Edit team info')
                .setStyle('SECONDARY'), new discord_js_1.MessageButton()
                .setCustomId('deleteTeam')
                .setLabel('🗑️  Delete team')
                .setStyle('DANGER'));
            const teamEmbed = new discord_js_1.MessageEmbed()
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
                    value: eventName,
                },
                {
                    name: 'Event Date and Time',
                    value: eventDateTime,
                },
                {
                    name: `Registered players 0/${maxNumTeamPlayers.length > 0
                        ? maxNumTeamPlayers[0]['maxNumTeamPlayers']
                        : 'unlimited'}`,
                    value: ` `,
                },
            ]);
            const teamId = await (0, teams_1.addTeam)({
                eventId: eventId,
                teamName: teamName,
                teamDescription: teamShortDescription,
                teamLeaderDiscordUserId: interaction.user.id,
                teamLeaderUsername: interaction.user.tag,
                discordServerId: interaction.guild.id,
            });
            teamEmbed.setFooter({
                text: `Team ID: ${teamId} Event ID: ${eventId}`,
            });
            const reply = await interaction.channel?.send({
                embeds: [teamEmbed],
                components: [buttons, manageTeamPlayersButtons, manageTeamButtons],
            });
            await (0, teams_1.setColumnValue)({
                data: [
                    {
                        id: teamId,
                        key: 'messageId',
                        value: reply.id,
                    },
                ],
            });
            await interaction.reply({
                embeds: [
                    (0, infoMessageEmbed_1.default)(':white_check_mark: Team created successfully', 'SUCCESS'),
                ],
                ephemeral: true,
            });
        }
        catch (err) {
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in modalFunctions/teamEvent/teamModal.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = teamModal;
