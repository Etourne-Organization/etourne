"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const infoMessageEmbed_1 = tslib_1.__importDefault(require("../../../globalUtils/infoMessageEmbed"));
const singlePlayers_1 = require("../../../supabase/supabaseFunctions/singlePlayers");
const unregister = {
    customId: 'normalEventUnregister',
    run: async (client, interaction) => {
        try {
            const eventId = interaction.message.embeds[0].footer?.text.split(': ')[1];
            const registeredPlayers = interaction.message.embeds[0].fields?.find((r) => r.name.includes('Registered players'));
            const tempSplit = registeredPlayers.value.split(' ');
            const playersSplitted = tempSplit.length <= 1 && tempSplit[0].length < 1
                ? ['']
                : tempSplit[1].includes('\n')
                    ? tempSplit[1].split('\n')
                    : [tempSplit[1]];
            const playerIndex = playersSplitted.indexOf(interaction.user.tag);
            if (playerIndex !== -1) {
                playersSplitted.splice(playerIndex, 1);
                interaction.message.embeds[0].fields?.find((r) => {
                    if (r.name.includes('Registered players')) {
                        let numRegisteredPlayers = parseInt(r.name.split(' ')[2].split('/')[0]);
                        const maxNumPlayers = r.name.split(' ')[2].split('/')[1];
                        numRegisteredPlayers -= 1;
                        r.name = `Registered players ${numRegisteredPlayers}/${maxNumPlayers}`;
                        r.value =
                            playersSplitted.length >= 1
                                ? '>>> ' + playersSplitted.join('\n')
                                : ' ';
                    }
                });
                const editedEmbed = new discord_js_1.MessageEmbed()
                    .setColor('#3a9ce2')
                    .setTitle(interaction.message.embeds[0].title || 'Undefined')
                    .setDescription(interaction.message.embeds[0].description || 'Undefined')
                    .addFields(interaction.message.embeds[0].fields || [])
                    .setFooter({ text: `Event ID: ${eventId}` });
                await (0, singlePlayers_1.removePlayer)({
                    discordUserId: interaction.user.id,
                    eventId: parseInt(eventId),
                });
                return await interaction.update({ embeds: [editedEmbed] });
            }
            else {
                return await interaction.reply({
                    embeds: [(0, infoMessageEmbed_1.default)('You are not registered!', 'WARNING')],
                    ephemeral: true,
                });
            }
        }
        catch (err) {
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in buttonFunctions/normalEvent/unregister.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = unregister;