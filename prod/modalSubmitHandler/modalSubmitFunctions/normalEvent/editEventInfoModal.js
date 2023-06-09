"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const events_1 = require("../../../supabase/supabaseFunctions/events");
const timezone_1 = require("../../../utilities/timezone");
const editEventInfoModal = {
    customId: 'editEventInfoModal',
    run: async (client, interaction) => {
        try {
            const eventId = interaction.message?.embeds[0].footer?.text.split(': ')[1];
            const registeredPlayers = interaction.message?.embeds[0].fields?.find((r) => r.name.includes('Registered players'));
            const eventDateTimeEmbedValue = interaction.message?.embeds[0].fields?.find((r) => r.name.includes('Event date & time'));
            const eventHost = interaction.message?.embeds[0].fields?.find((r) => r.name.includes('Hosted by'));
            const eventName = interaction.fields.getTextInputValue('eventName');
            const gameName = interaction.fields.getTextInputValue('gameName');
            const timezone = interaction.fields.getTextInputValue('timezone');
            const eventDateTime = interaction.fields.getTextInputValue('date');
            const description = interaction.fields.getTextInputValue('eventDescription');
            const editedEmbed = new discord_js_1.MessageEmbed()
                .setColor('#3a9ce2')
                .setTitle(eventName)
                .setDescription(`**----------------------------------------** \n **Event description:** \n \n >>> ${description}  \n \n`)
                .addFields([
                {
                    name: 'Event date & time',
                    value: eventDateTime
                        ? `<t:${moment_timezone_1.default
                            .tz(`${eventDateTime.split(' ')[0]}T${eventDateTime.split(' ')[1]}`, `${timezone_1.isoParsingDateFormat}T${timezone_1.isoTimeFormat}`, (0, timezone_1.getTimzeonValueFromLabel)(timezone))
                            .unix()}:F>`
                        : eventDateTimeEmbedValue['value'],
                    inline: true,
                },
                { name: 'Game name', value: gameName, inline: true },
                { name: 'Hosted by', value: `${eventHost.value}` },
                {
                    name: registeredPlayers.name,
                    value: registeredPlayers.value.length <= 0
                        ? ' '
                        : registeredPlayers.value,
                },
            ])
                .setFooter({
                text: `Event ID: ${eventId}`,
            });
            if (!interaction.inCachedGuild())
                return;
            await (0, events_1.updateEvent)({
                eventId: eventId,
                eventName: eventName,
                gameName: gameName,
                description: description,
                dateTime: eventDateTime
                    ? new Date(moment_timezone_1.default
                        .tz(`${eventDateTime.split(' ')[0]}T${eventDateTime.split(' ')[1]}`, `${timezone_1.isoParsingDateFormat}T${timezone_1.isoTimeFormat}`, (0, timezone_1.getTimzeonValueFromLabel)(timezone))
                        .format()).toISOString()
                    : null,
                isTeamEvent: false,
                discordServerId: interaction.guild.id,
                timezone: timezone,
            });
            return await interaction.update({
                embeds: [editedEmbed],
            });
        }
        catch (err) {
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in modalFunctions/normalEvent/editEventInfoModal.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = editEventInfoModal;
