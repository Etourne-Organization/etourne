"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const infoMessageEmbed_1 = tslib_1.__importDefault(require("../../../globalUtils/infoMessageEmbed"));
const singlePlayers_1 = require("../../../supabase/supabaseFunctions/singlePlayers");
const events_1 = require("../../../supabase/supabaseFunctions/events");
const removePlayer = {
    customId: 'removePlayer',
    run: async (client, interaction) => {
        try {
            const username = interaction.values[0].split('||')[0];
            const userId = interaction.values[0].split('||')[1];
            const eventId = interaction.message.embeds[0].footer?.text.split(': ')[1];
            const confirmationButtons = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                .setCustomId('deleteYes')
                .setLabel('✔')
                .setStyle('PRIMARY'), new discord_js_1.MessageButton()
                .setCustomId('deleteNo')
                .setLabel('✖')
                .setStyle('SECONDARY'));
            await interaction.update({
                embeds: [
                    (0, infoMessageEmbed_1.default)(`Are you sure you want to remove ${username}?`),
                ],
                components: [confirmationButtons],
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
                    await interaction.deleteReply();
                    const messageId = await (0, events_1.getColumnValueById)({
                        columnName: 'messageId',
                        id: parseInt(eventId),
                    });
                    const fetchedMessage = await interaction.channel?.messages.fetch(messageId[0]['messageId']);
                    if (fetchedMessage) {
                        const footer = fetchedMessage.embeds[0].footer?.text;
                        let FOUND = false;
                        const registeredPlayers = fetchedMessage.embeds[0].fields?.find((r) => r.name.includes('Registered players'));
                        const oldPlayersList = registeredPlayers.value
                            .split('>>> ')[1]
                            .split('\n');
                        const index = oldPlayersList.indexOf(username);
                        oldPlayersList.splice(index, 1);
                        const newPlayersList = oldPlayersList.join('\n');
                        fetchedMessage.embeds[0].fields?.find((r) => {
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
                        await (0, singlePlayers_1.removePlayer)({
                            discordUserId: userId,
                            eventId: eventId,
                        });
                        const editedEmbed = new discord_js_1.MessageEmbed()
                            .setColor('#3a9ce2')
                            .setTitle(fetchedMessage.embeds[0].title || 'Undefined')
                            .setDescription(fetchedMessage.embeds[0].description || 'Undefined')
                            .addFields(fetchedMessage.embeds[0].fields || [])
                            .setFooter({ text: `${footer}` });
                        FOUND = true;
                        await fetchedMessage.edit({
                            embeds: [editedEmbed],
                        });
                    }
                    await i.reply({
                        embeds: [
                            (0, infoMessageEmbed_1.default)(`:white_check_mark: Removed ${username} successfully!`, 'SUCCESS'),
                        ],
                        ephemeral: true,
                    });
                }
                else if (i.customId === 'deleteNo') {
                    await interaction.deleteReply();
                    await i.reply({
                        embeds: [
                            (0, infoMessageEmbed_1.default)(`:x: Player ${username} was not deleted`),
                        ],
                        ephemeral: true,
                    });
                }
            });
        }
        catch (err) {
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in selectMenuFunctions/removePlayer/removePlayer.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = removePlayer;
