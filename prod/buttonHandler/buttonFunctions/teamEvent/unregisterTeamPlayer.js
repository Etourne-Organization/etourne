"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const infoMessageEmbed_1 = tslib_1.__importDefault(require("../../../globalUtils/infoMessageEmbed"));
const teamPlayers_1 = require("../../../supabase/supabaseFunctions/teamPlayers");
const teams_1 = require("../../../supabase/supabaseFunctions/teams");
const unregisterTeamPlayer = {
    customId: 'unregisterTeamPlayer',
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
            const registeredPlayers = interaction.message.embeds[0].fields?.find((r) => r.name.includes('Registered players'));
            let newPlayersList = ' ';
            if (registeredPlayers.value.length === 0) {
                return await interaction.reply({
                    embeds: [
                        (0, infoMessageEmbed_1.default)('The registration list is empty!', 'WARNING'),
                    ],
                    ephemeral: true,
                });
            }
            else {
                const oldPlayersList = registeredPlayers.value
                    .split('>>> ')[1]
                    .split('\n');
                if (oldPlayersList.indexOf(interaction.user.tag) === -1) {
                    return await interaction.reply({
                        embeds: [
                            (0, infoMessageEmbed_1.default)('You are not registered!', 'WARNING'),
                        ],
                        ephemeral: true,
                    });
                }
                const index = oldPlayersList.indexOf(interaction.user.tag);
                oldPlayersList.splice(index, 1);
                newPlayersList = oldPlayersList.join('\n');
            }
            interaction.message.embeds[0].fields?.find((r) => {
                if (r.name.includes('Registered players')) {
                    let numRegisteredPlayers = parseInt(r.name.split(' ')[2].split('/')[0]);
                    const maxNumPlayersEmbedValue = r.name
                        .split(' ')[2]
                        .split('/')[1];
                    numRegisteredPlayers -= 1;
                    r.name = `Registered players ${numRegisteredPlayers}/${maxNumPlayersEmbedValue}`;
                    r.value = `${newPlayersList.length > 0 ? '>>>' : ' '} ${newPlayersList}`;
                }
            });
            await (0, teamPlayers_1.removePlayer)({
                discordUserId: interaction.user.id,
                teamId: parseInt(teamId),
            });
            const editedEmbed = new discord_js_1.MessageEmbed()
                .setColor('#3a9ce2')
                .setTitle(interaction.message.embeds[0].title || 'Undefined')
                .setDescription(interaction.message.embeds[0].description || 'Undefined')
                .addFields(interaction.message.embeds[0].fields || [])
                .setFooter({ text: `${footer}` });
            return await interaction.update({ embeds: [editedEmbed] });
        }
        catch (err) {
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in buttonFunctions/teamEvent/unregisterTeamPlayer.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = unregisterTeamPlayer;
