"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const events_1 = require("../../../supabase/supabaseFunctions/events");
const users_1 = require("../../../supabase/supabaseFunctions/users");
const infoMessageEmbed_1 = tslib_1.__importDefault(require("../../../globalUtils/infoMessageEmbed"));
const editEventInfo = {
    customId: 'editEventInfo',
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
            const eventId = interaction.message.embeds[0].footer?.text.split(': ')[1];
            const allColumnValue = await (0, events_1.getAllColumnValueById)({ id: eventId });
            const modal = new discord_js_1.Modal()
                .setCustomId(`editEventInfoModal-${interaction.id}`)
                .setTitle('Edit event');
            const eventNameInput = new discord_js_1.TextInputComponent()
                .setCustomId('eventName')
                .setLabel('Event name')
                .setStyle('SHORT')
                .setPlaceholder('Event name')
                .setValue(allColumnValue[0]['eventName']);
            const gameNameInput = new discord_js_1.TextInputComponent()
                .setCustomId('gameName')
                .setLabel('Game name')
                .setStyle('SHORT')
                .setPlaceholder('Game name')
                .setValue(allColumnValue[0]['gameName']);
            const eventDateTimeInput = new discord_js_1.TextInputComponent()
                .setCustomId('date')
                .setLabel('Date (format: DD/MM/YYYY hour:minute)')
                .setStyle('SHORT')
                .setPlaceholder('Leave empty if changing not required');
            const eventTimezoneInput = new discord_js_1.TextInputComponent()
                .setCustomId('timezone')
                .setLabel('Your timezone: timezones.etourne.xyz')
                .setStyle('SHORT')
                .setPlaceholder('Your timezone')
                .setValue(allColumnValue[0]['timezone']);
            const eventDescriptionInput = new discord_js_1.TextInputComponent()
                .setCustomId('eventDescription')
                .setLabel('Event description')
                .setStyle('PARAGRAPH')
                .setPlaceholder('Event description')
                .setValue(allColumnValue[0]['description']);
            const eventNameActionRow = new discord_js_1.MessageActionRow().addComponents(eventNameInput);
            const gameNameActionRow = new discord_js_1.MessageActionRow().addComponents(gameNameInput);
            const eventTimezoneActionRow = new discord_js_1.MessageActionRow().addComponents(eventTimezoneInput);
            const eventDateTimeActionRow = new discord_js_1.MessageActionRow().addComponents(eventDateTimeInput);
            const eventDescriptionActionRow = new discord_js_1.MessageActionRow().addComponents(eventDescriptionInput);
            modal.addComponents(eventNameActionRow, gameNameActionRow, eventTimezoneActionRow, eventDateTimeActionRow, eventDescriptionActionRow);
            await interaction.showModal(modal);
        }
        catch (err) {
            try {
                console.log(err);
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in buttonFunctions/normalEvent/editEventInfo.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = editEventInfo;
