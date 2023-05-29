"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const infoMessageEmbed_1 = tslib_1.__importDefault(require("../../../globalUtils/infoMessageEmbed"));
const users_1 = require("../../../supabase/supabaseFunctions/users");
const events_1 = require("../../../supabase/supabaseFunctions/events");
const deleteEvent = {
    customId: 'deleteEvent',
    run: async (client, interaction) => {
        try {
            const userRoleDB = await (0, users_1.getUserRole)({
                discordUserId: interaction.user.id,
                discordServerId: interaction.guild.id,
            });
            if (userRoleDB.length === 0 ||
                (userRoleDB[0]['roleId'] !== 3 && userRoleDB[0]['roleId'] !== 2)) {
                return await interaction.reply({
                    embeds: [
                        (0, infoMessageEmbed_1.default)(':warning: You are not allowed to use this button!', 'WARNING'),
                    ],
                    ephemeral: true,
                });
            }
            const eventId = interaction.message.embeds[0].footer?.text.split(': ')[1];
            const fetchedMessage = await interaction.channel?.messages.fetch(interaction.message.id);
            if (fetchedMessage) {
                const confirmationButtons = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                    .setCustomId(`deleteYes-${interaction.id}`)
                    .setLabel('✔')
                    .setStyle('PRIMARY'), new discord_js_1.MessageButton()
                    .setCustomId(`deleteNo-${interaction.id}`)
                    .setLabel('✖')
                    .setStyle('SECONDARY'));
                await interaction.reply({
                    embeds: [
                        (0, infoMessageEmbed_1.default)('Are you sure you want to delete the event?'),
                    ],
                    components: [confirmationButtons],
                    ephemeral: true,
                });
                const filter = (i) => (i.customId === `deleteYes-${interaction.id}` ||
                    i.customId === `deleteNo-${interaction.id}`) &&
                    i.user.id === interaction.user.id;
                const collector = interaction.channel?.createMessageComponentCollector({
                    filter,
                    time: 15000,
                });
                collector?.on('collect', async (i) => {
                    if (i.customId.includes('deleteYes')) {
                        await fetchedMessage.delete();
                        console.log('deleting' + eventId);
                        await (0, events_1.deleteEvent)({ eventId: parseInt(eventId) });
                        await interaction.deleteReply();
                        await i.reply({
                            embeds: [
                                (0, infoMessageEmbed_1.default)(':white_check_mark: Event deleted successfully!', 'SUCCESS'),
                            ],
                            ephemeral: true,
                        });
                    }
                    else if (i.customId.includes('deleteNo')) {
                        await interaction.deleteReply();
                        await i.reply({
                            embeds: [(0, infoMessageEmbed_1.default)(':x: Event not deleted')],
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
            console.log(err);
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in buttonFunctions/allEventButtonFunctions/deleteEvent.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = deleteEvent;
