"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const events_1 = require("../../supabase/supabaseFunctions/events");
const listServerEvents = {
    name: 'listserverevents',
    description: 'View the list of all the servers',
    run: async (client, interaction) => {
        try {
            const allEvents = await (0, events_1.getAllServerEvents)({
                discordServerId: interaction.guild.id,
            });
            let eventString = '';
            allEvents.forEach((e) => {
                const date = new Date(moment_timezone_1.default.tz(e['dateTime'], e['timezone']).format());
                const [day, month, year, hour, minute] = [
                    date.getDate(),
                    date.getMonth() + 1,
                    date.getFullYear(),
                    date.getHours(),
                    date.getMinutes(),
                ];
                eventString += `## ${e.eventName}\n**Game name:** ${e.gameName}\n**Date and Time:** <t:${moment_timezone_1.default
                    .tz(`${day}/${month}/${year} ${hour}:${minute}`, 'DD/MM/YYYY hh:mm', e.timezone)
                    .unix()}:F>\n**Event type:** ${e.isTeamEvent ? 'Team' : 'Normal (no team)'}\n\n`;
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
