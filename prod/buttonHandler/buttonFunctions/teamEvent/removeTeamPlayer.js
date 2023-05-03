"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const infoMessageEmbed_1 = tslib_1.__importDefault(require("../../../globalUtils/infoMessageEmbed"));
const teams_1 = require("../../../supabase/supabaseFunctions/teams");
const teamPlayers_1 = require("../../../supabase/supabaseFunctions/teamPlayers");
const users_1 = require("../../../supabase/supabaseFunctions/users");
const removeTeamPlayer = {
    customId: 'removeTeamPlayer',
    run: async (client, interaction) => {
        try {
            const footer = interaction.message.embeds[0].footer?.text;
            const teamId = interaction.message.embeds[0].footer?.text.split(' ')[2];
            if (!(await (0, teams_1.checkTeamExists)({ teamId: parseInt(teamId) }))) {
                return interaction.reply({
                    embeds: [
                        (0, infoMessageEmbed_1.default)('The team does not exist anymore, maybe it was deleted?', 'WARNING'),
                    ],
                    ephemeral: true,
                });
            }
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
            const teamPlayers = await (0, teamPlayers_1.getAllTeamPlayers)({
                teamId: parseInt(teamId),
            });
            if (!(teamPlayers.length > 0))
                return interaction.reply({
                    embeds: [
                        (0, infoMessageEmbed_1.default)('There are no team players to remove!', 'WARNING'),
                    ],
                    ephemeral: true,
                });
            const selectMenuOptions = [{ label: ' ', description: ' ', value: ' ' }];
            teamPlayers.forEach((tp, i) => {
                if (tp.username === interaction.user.tag)
                    return;
                selectMenuOptions[i] = {
                    label: tp.username,
                    description: `Remove ${tp.username}`,
                    value: `${tp.username}|${tp.userId}`,
                };
            });
            const selectMenu = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageSelectMenu()
                .setCustomId('removeTeamPlayer')
                .setPlaceholder('Select a player to be removed')
                .addOptions(selectMenuOptions));
            const selectMessageEmbed = new discord_js_1.MessageEmbed()
                .setTitle('Select team player to be removed')
                .setColor('#3A9CE2')
                .setFooter({ text: `${footer}` })
                .setTimestamp();
            await interaction.reply({
                embeds: [selectMessageEmbed],
                ephemeral: true,
                components: [selectMenu],
            });
        }
        catch (err) {
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in buttonFunctions/teamEvent/removeTeamPlayers.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = removeTeamPlayer;
