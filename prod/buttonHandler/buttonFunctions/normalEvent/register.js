"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const infoMessageEmbed_1 = tslib_1.__importDefault(require("../../../globalUtils/infoMessageEmbed"));
const singlePlayers_1 = require("../../../supabase/supabaseFunctions/singlePlayers");
const events_1 = require("../../../supabase/supabaseFunctions/events");
const register = {
    customId: 'normalEventRegister',
    run: async (client, interaction) => {
        try {
            const eventId = interaction.message.embeds[0].footer?.text.split(': ')[1];
            const maxNumPlayers = await (0, events_1.getColumnValueById)({
                id: eventId,
                columnName: 'maxNumPlayers',
            });
            if (maxNumPlayers.length > 0 &&
                (await (0, singlePlayers_1.getNumOfPlayers)({ eventId: eventId })) ===
                    maxNumPlayers[0]['maxNumPlayers']) {
                return await interaction.reply({
                    embeds: [
                        (0, infoMessageEmbed_1.default)('Number of players has reached the limit!', 'WARNING'),
                    ],
                    ephemeral: true,
                });
            }
            const registeredPlayers = interaction.message.embeds[0].fields?.find((r) => r.name.includes('Registered players'));
            let newPlayersList = ' ';
            if (registeredPlayers.value.length === 0) {
                newPlayersList = `${interaction.user.tag}\n`;
            }
            else {
                if (registeredPlayers.value
                    .split('>>> ')[1]
                    .split('\n')
                    .indexOf(interaction.user.tag) !== -1) {
                    return await interaction.reply({
                        embeds: [
                            (0, infoMessageEmbed_1.default)('You are already registered!', 'WARNING'),
                        ],
                        ephemeral: true,
                    });
                }
                else {
                    const oldPlayersList = registeredPlayers.value
                        .split('>>> ')[1]
                        .split('\n');
                    oldPlayersList.push(interaction.user.tag);
                    newPlayersList = oldPlayersList.join('\n');
                }
            }
            interaction.message.embeds[0].fields?.find((r) => {
                if (r.name.includes('Registered players')) {
                    let numRegisteredPlayers = parseInt(r.name.split(' ')[2].split('/')[0]);
                    const maxNumPlayersEmbedValue = r.name
                        .split(' ')[2]
                        .split('/')[1];
                    numRegisteredPlayers += 1;
                    r.name = `Registered players ${numRegisteredPlayers}/${maxNumPlayersEmbedValue}`;
                    r.value = `>>> ${newPlayersList}`;
                }
            });
            await (0, singlePlayers_1.addPlayer)({
                username: interaction.user.tag,
                discordUserId: interaction.user.id,
                eventId: parseInt(eventId),
                discordServerId: interaction.guild?.id,
            });
            const editedEmbed = new discord_js_1.MessageEmbed()
                .setColor('#3a9ce2')
                .setTitle(interaction.message.embeds[0].title || 'Undefined')
                .setDescription(interaction.message.embeds[0].description || 'Undefined')
                .addFields(interaction.message.embeds[0].fields || [])
                .setFooter({ text: `Event ID: ${eventId}` });
            await interaction.update({ embeds: [editedEmbed] });
        }
        catch (err) {
            try {
                console.log(err);
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in buttonFunctions/normalEvent/register.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = register;
