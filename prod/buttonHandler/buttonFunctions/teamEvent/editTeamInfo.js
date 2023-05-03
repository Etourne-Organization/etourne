"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const infoMessageEmbed_1 = tslib_1.__importDefault(require("../../../globalUtils/infoMessageEmbed"));
const teams_1 = require("../../../supabase/supabaseFunctions/teams");
const users_1 = require("../../../supabase/supabaseFunctions/users");
const editTeamInfo = {
    customId: 'editTeamInfo',
    run: async (client, interaction) => {
        try {
            const teamId = interaction.message.embeds[0].footer?.text.split(' ')[2];
            const eventId = interaction.message.embeds[0].footer?.text.split(' ')[5];
            if (!(await (0, teams_1.checkTeamExists)({ teamId: parseInt(teamId) }))) {
                return interaction.reply({
                    embeds: [
                        (0, infoMessageEmbed_1.default)(':warning: The team does not exist anymore, maybe it was deleted?', 'WARNING'),
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
            const allColumnValue = await (0, teams_1.getAllColumnValueById)({ id: teamId });
            const teamFormModal = new discord_js_1.Modal()
                .setCustomId(`editTeamInfoModal-${interaction.id}`)
                .setTitle('Create Team');
            const teamNameInput = new discord_js_1.TextInputComponent()
                .setCustomId('teamName')
                .setLabel('Team Name')
                .setStyle('SHORT')
                .setPlaceholder('Enter team name')
                .setValue(allColumnValue[0]['name']);
            const teamSmallDescriptionInput = new discord_js_1.TextInputComponent()
                .setCustomId('teamShortDescription')
                .setLabel('Team Short Description')
                .setStyle('SHORT')
                .setPlaceholder('Enter short team description')
                .setValue(allColumnValue[0]['description']);
            const teamNameActionRow = new discord_js_1.MessageActionRow().addComponents(teamNameInput);
            const teamSmallDescriptionActionRow = new discord_js_1.MessageActionRow().addComponents(teamSmallDescriptionInput);
            teamFormModal.addComponents(teamNameActionRow, teamSmallDescriptionActionRow);
            await interaction.showModal(teamFormModal);
        }
        catch (err) {
            try {
                console.log(err);
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in buttonFunctions/teamEvent/editTeamInfo.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = editTeamInfo;
