"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const teams_1 = require("../../../supabase/supabaseFunctions/teams");
const events_1 = require("../../../supabase/supabaseFunctions/events");
const infoMessageEmbed_1 = tslib_1.__importDefault(require("../../../globalUtils/infoMessageEmbed"));
const createTeam = {
    customId: 'createTeam',
    run: async (client, interaction) => {
        try {
            const eventId = interaction.message.embeds[0].footer?.text.split(': ')[1];
            const maxNumTeams = await (0, events_1.getColumnValueById)({
                id: eventId,
                columnName: 'maxNumTeams',
            });
            if (maxNumTeams.length > 0 &&
                (await (0, teams_1.getNumOfTeams)({ eventId: eventId })) ===
                    maxNumTeams[0]['maxNumTeams']) {
                return await interaction.reply({
                    embeds: [
                        (0, infoMessageEmbed_1.default)('Number of team has reached the limit!', 'WARNING'),
                    ],
                    ephemeral: true,
                });
            }
            const teamFormModal = new discord_js_1.Modal()
                .setCustomId(`teamModalSubmit-${interaction.id}`)
                .setTitle('Create Team');
            const teamNameInput = new discord_js_1.TextInputComponent()
                .setCustomId('teamName')
                .setLabel('Team Name')
                .setStyle('SHORT')
                .setPlaceholder('Enter team name');
            const teamSmallDescriptionInput = new discord_js_1.TextInputComponent()
                .setCustomId('teamShortDescription')
                .setLabel('Team Short Description')
                .setStyle('SHORT')
                .setPlaceholder('Enter short team description');
            const teamNameActionRow = new discord_js_1.MessageActionRow().addComponents(teamNameInput);
            const teamSmallDescriptionActionRow = new discord_js_1.MessageActionRow().addComponents(teamSmallDescriptionInput);
            teamFormModal.addComponents(teamNameActionRow, teamSmallDescriptionActionRow);
            await interaction.showModal(teamFormModal);
        }
        catch (err) {
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in buttonFunctions/teamEvent/createTeam.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = createTeam;
