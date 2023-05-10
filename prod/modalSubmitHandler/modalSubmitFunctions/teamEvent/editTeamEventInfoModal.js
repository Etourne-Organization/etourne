"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const events_1 = require("../../../supabase/supabaseFunctions/events");
const updateAllTeamInfo_1 = tslib_1.__importDefault(require("./utils/updateAllTeamInfo"));
const editTeamEventInfoModal = {
    customId: 'editTeamEventInfoModal',
    run: async (client, interaction) => {
        try {
            const eventId = interaction.message?.embeds[0].footer?.text.split(': ')[1];
            const eventName = interaction.fields.getTextInputValue('eventName');
            const gameName = interaction.fields.getTextInputValue('gameName');
            const timezone = interaction.fields.getTextInputValue('timezone');
            const eventDateTime = interaction.fields.getTextInputValue('date');
            const description = interaction.fields.getTextInputValue('eventDescription');
            const maxNumTeams = await (0, events_1.getColumnValueById)({
                id: eventId,
                columnName: 'maxNumTeams',
            });
            const maxNumTeamPlayers = await (0, events_1.getColumnValueById)({
                id: eventId,
                columnName: 'maxNumTeamPlayers',
            });
            const eventHost = interaction.message?.embeds[0].fields?.find((r) => r.name === 'Hosted by');
            const editedEmbed = new discord_js_1.MessageEmbed()
                .setColor('#3a9ce2')
                .setTitle(eventName)
                .setDescription(`**----------------------------------------** \n **Event description:** \n \n >>> ${description}  \n \n`)
                .addFields([
                {
                    name: 'Event date & time',
                    value: `<t:${moment_timezone_1.default
                        .tz(eventDateTime, 'DD/MM/YYYY hh:mm', timezone)
                        .unix()}:F>`,
                    inline: true,
                },
                { name: 'Game name', value: gameName, inline: true },
                {
                    name: 'Max num of teams',
                    value: maxNumTeams[0]['maxNumTeams']
                        ? maxNumTeams[0]['maxNumTeams'].toString()
                        : 'Unlimited',
                },
                {
                    name: 'Max num of team players',
                    value: maxNumTeamPlayers[0]['maxNumTeamPlayers']
                        ? maxNumTeamPlayers[0]['maxNumTeamPlayers'].toString()
                        : 'Unlimited',
                },
                { name: 'Hosted by', value: `${eventHost.value}` },
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
                dateTime: new Date(moment_timezone_1.default
                    .tz(eventDateTime, 'DD/MM/YYYY hh:mm', timezone)
                    .format()).toISOString(),
                isTeamEvent: false,
                discordServerId: interaction.guild.id,
                timezone: timezone,
            });
            (0, updateAllTeamInfo_1.default)({
                eventId: eventId,
                interaction: interaction,
            });
            return await interaction.update({
                embeds: [editedEmbed],
            });
        }
        catch (err) {
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in modalFunctions/teamEvent/editTeamEventInfoModal.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = editTeamEventInfoModal;
