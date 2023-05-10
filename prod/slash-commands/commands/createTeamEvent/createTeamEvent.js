"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const infoMessageEmbed_1 = tslib_1.__importDefault(require("../../../globalUtils/infoMessageEmbed"));
const users_1 = require("../../../supabase/supabaseFunctions/users");
const createTeamEvent = {
    name: 'createteamevent',
    description: 'Create team event',
    type: 'CHAT_INPUT',
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
            const modal = new discord_js_1.Modal()
                .setCustomId(`teamEventModalSubmit-${interaction.id}`)
                .setTitle('Create Team Event');
            const eventNameInput = new discord_js_1.TextInputComponent()
                .setCustomId('eventName')
                .setLabel('Event name')
                .setStyle('SHORT')
                .setPlaceholder('Event name')
                .setRequired(true);
            const gameNameInput = new discord_js_1.TextInputComponent()
                .setCustomId('gameName')
                .setLabel('Game name')
                .setStyle('SHORT')
                .setPlaceholder('Game name')
                .setRequired(true);
            const eventDateTimeInput = new discord_js_1.TextInputComponent()
                .setCustomId('date')
                .setLabel('Date (format: DD/MM/YYYY hour:minute)')
                .setStyle('SHORT')
                .setPlaceholder('Event date')
                .setRequired(true);
            const eventTimezoneInput = new discord_js_1.TextInputComponent()
                .setCustomId('timezone')
                .setLabel('Your timezone: timezones.etourne.xyz')
                .setStyle('SHORT')
                .setPlaceholder('Your timezone')
                .setRequired(true);
            const eventDescriptionInput = new discord_js_1.TextInputComponent()
                .setCustomId('eventDescription')
                .setLabel('Event description')
                .setStyle('PARAGRAPH')
                .setPlaceholder('Event description')
                .setRequired(true);
            const eventNameActionRow = new discord_js_1.MessageActionRow().addComponents(eventNameInput);
            const gameNameActionRow = new discord_js_1.MessageActionRow().addComponents(gameNameInput);
            const eventTimezoneActionRow = new discord_js_1.MessageActionRow().addComponents(eventTimezoneInput);
            const eventDateTimeActionRow = new discord_js_1.MessageActionRow().addComponents(eventDateTimeInput);
            const eventDescriptionActionRow = new discord_js_1.MessageActionRow().addComponents(eventDescriptionInput);
            modal.addComponents(eventNameActionRow, gameNameActionRow, eventTimezoneActionRow, eventDateTimeActionRow, eventDescriptionActionRow);
            await interaction.showModal(modal);
        }
        catch (err) {
            interaction.reply({
                embeds: [(0, infoMessageEmbed_1.default)(':x: There has been an error', 'ERROR')],
            });
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in slashcommands/createTeamEvent/createTeamEvent.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = createTeamEvent;
