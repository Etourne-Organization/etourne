"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const infoMessageEmbed_1 = tslib_1.__importDefault(require("../../../globalUtils/infoMessageEmbed"));
const singlePlayers_1 = require("../../../supabase/supabaseFunctions/singlePlayers");
const users_1 = require("../../../supabase/supabaseFunctions/users");
const removePlayer = {
    customId: 'removePlayer',
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
                        (0, infoMessageEmbed_1.default)(':warning: You are not allowed to run this command!', 'WARNING'),
                    ],
                    ephemeral: true,
                });
            }
            const footer = interaction.message.embeds[0].footer?.text;
            const eventId = interaction.message.embeds[0].footer?.text.split(': ')[1];
            const players = await (0, singlePlayers_1.getAllPlayers)({
                eventId: parseInt(eventId),
            });
            if (!(players.length > 0))
                return interaction.reply({
                    embeds: [
                        (0, infoMessageEmbed_1.default)('There are no players to remove!', 'WARNING'),
                    ],
                    ephemeral: true,
                });
            const selectMenuOptions = [{ label: ' ', description: ' ', value: ' ' }];
            players.forEach((tp, i) => {
                if (tp.username === interaction.user.tag)
                    return;
                selectMenuOptions[i] = {
                    label: tp.username,
                    description: `Remove ${tp.username}`,
                    value: `${tp.username}|${tp.userId}`,
                };
            });
            const selectMenu = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageSelectMenu()
                .setCustomId('removePlayer')
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
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in buttonFunctions/normalEvent/removePlayers.ts \n Actual error: ${err} \n \n`, (err) => {
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
