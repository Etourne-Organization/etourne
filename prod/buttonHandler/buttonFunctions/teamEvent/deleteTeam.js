"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const infoMessageEmbed_1 = tslib_1.__importDefault(require("../../../globalUtils/infoMessageEmbed"));
const teams_1 = require("../../../supabase/supabaseFunctions/teams");
const users_1 = require("../../../supabase/supabaseFunctions/users");
const deleteTeam = {
    customId: 'deleteTeam',
    run: async (client, interaction) => {
        try {
            const teamLeader = interaction.message?.embeds[0].fields?.find((r) => r.name === 'Team Leader');
            const userRoleDB = await (0, users_1.getUserRole)({
                discordUserId: interaction.user.id,
                discordServerId: interaction.guild.id,
            });
            if (interaction.user.tag !== teamLeader.value &&
                (userRoleDB.length === 0 ||
                    (userRoleDB[0]['roleId'] !== 3 && userRoleDB[0]['roleId'] !== 2))) {
                return interaction.reply({
                    embeds: [
                        (0, infoMessageEmbed_1.default)(':warning: You are not allowed to use this button!', 'WARNING'),
                    ],
                    ephemeral: true,
                });
            }
            const teamId = interaction.message.embeds[0].footer?.text.split(' ')[2];
            const fetchedMessage = await interaction.channel?.messages.fetch(interaction.message.id);
            if (fetchedMessage) {
                const confirmationButtons = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                    .setCustomId('deleteYes')
                    .setLabel('✔')
                    .setStyle('PRIMARY'), new discord_js_1.MessageButton()
                    .setCustomId('deleteNo')
                    .setLabel('✖')
                    .setStyle('SECONDARY'));
                await interaction.reply({
                    embeds: [
                        (0, infoMessageEmbed_1.default)('Are you sure you want to delete your team?'),
                    ],
                    components: [confirmationButtons],
                    ephemeral: true,
                });
                const filter = (i) => (i.customId === 'deleteYes' || i.customId === 'deleteNo') &&
                    i.user.id === interaction.user.id;
                const collector = interaction.channel?.createMessageComponentCollector({
                    filter,
                    time: 15000,
                    max: 1,
                    maxComponents: 1,
                });
                collector?.on('collect', async (i) => {
                    if (i.customId === 'deleteYes') {
                        await fetchedMessage.delete();
                        await interaction.deleteReply();
                        if (await (0, teams_1.checkTeamExists)({ teamId: teamId }))
                            await (0, teams_1.deleteTeam)({ teamId: parseInt(teamId) });
                        await i.reply({
                            embeds: [
                                (0, infoMessageEmbed_1.default)(':white_check_mark: Team deleted successfully!', 'SUCCESS'),
                            ],
                            ephemeral: true,
                        });
                    }
                    else if (i.customId === 'deleteNo') {
                        await interaction.deleteReply();
                        await i.reply({
                            embeds: [(0, infoMessageEmbed_1.default)(':x: Team was not deleted')],
                            ephemeral: true,
                        });
                    }
                });
            }
            else {
                await interaction.reply({
                    embeds: [(0, infoMessageEmbed_1.default)('Something went wrong', 'WARNING')],
                    ephemeral: true,
                });
            }
        }
        catch (err) {
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in buttonFunctions/teamEvent/deleteTeam.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = deleteTeam;
