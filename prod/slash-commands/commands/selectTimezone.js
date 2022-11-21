"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const selectTimezone = {
    name: 'selecttimezone',
    description: 'Set your timezone',
    type: 'CHAT_INPUT',
    run: async (client, interaction) => {
        try {
            const allTimezones = moment_timezone_1.default.tz.names().map((tz) => {
                return {
                    label: tz,
                    description: tz,
                    value: tz,
                };
            });
            const selectMenu = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageSelectMenu()
                .setCustomId('timezone-select')
                .setPlaceholder('Select your timezone')
                .addOptions(allTimezones));
            const embed = new discord_js_1.MessageEmbed()
                .setColor('#3a9ce2')
                .setTitle('Select your timezone');
            await interaction.reply({
                embeds: [embed],
                components: [selectMenu],
                ephemeral: true,
            });
            client.on('interactionCreate', async (i) => {
                if (i.isSelectMenu()) {
                    await i.reply({
                        content: 'You selected your timezone!',
                        ephemeral: true,
                    });
                }
            });
        }
        catch (err) {
            console.log({
                actualError: err,
                message: 'Something went wrong in selectTimezone.ts',
            });
        }
    },
};
exports.default = selectTimezone;
