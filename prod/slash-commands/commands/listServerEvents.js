"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const events_1 = require("../../supabase/supabaseFunctions/events");
const listServerEvents = {
    name: 'listserverevents',
    description: 'View the list of all the servers',
    run: async (client, interaction) => {
        try {
            const allEvents = await (0, events_1.getAllServerEvents)({
                discordServerId: interaction.guild.id,
            });
            let eventString = allEvents.length > 0 ? '' : 'No events';
            allEvents.forEach((e) => {
                const date = new Date(moment_timezone_1.default.tz(e['dateTime'], 'CST6CDT').format());
                eventString += `## ${e.eventName}\n**ID:** ${e.id}\n**Game name:** ${e.gameName}\n**Date and Time:** <t:${(0, dayjs_1.default)(e['dateTime']).unix()}:F>\n**Event type:** ${e.isTeamEvent ? 'Team' : 'Normal (no team)'}\n\n`;
            });
            const embed = new discord_js_1.MessageEmbed()
                .setColor('#3a9ce2')
                .setTitle(`All events in ${interaction.guild?.name}`)
                .setThumbnail(`${interaction.guild.iconURL()}`)
                .setDescription(eventString);
            await interaction.reply({
                embeds: [embed],
            });
        }
        catch (err) {
            console.log(err);
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in slashcommands/serverEventsList.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = listServerEvents;
