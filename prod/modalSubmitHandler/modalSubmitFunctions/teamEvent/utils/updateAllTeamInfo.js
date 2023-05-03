"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const teams_1 = require("../../../../supabase/supabaseFunctions/teams");
const events_1 = require("../../../../supabase/supabaseFunctions/events");
const updateAllTeamInfo = async (props) => {
    try {
        const { eventId, interaction } = props;
        const values = await (0, teams_1.getColumnValueByEventId)({
            eventId: eventId,
            columnName: '*',
        });
        if (values.length > 0) {
            for (const value of values) {
                const fetchedMessage = await interaction.channel?.messages.fetch(value['messageId']);
                if (fetchedMessage) {
                    const registeredPlayers = fetchedMessage.embeds[0].fields?.find((r) => r.name.includes('Registered players'));
                    const numRegisteredPlayers = parseInt(registeredPlayers.name.split(' ')[2].split('/')[0]);
                    const eventInfo = await (0, events_1.getColumnValueById)({
                        id: eventId,
                        columnName: 'eventName, dateTime, timezone, maxNumTeamPlayers',
                    });
                    const date = new Date(moment_timezone_1.default
                        .tz(eventInfo[0]['dateTime'], eventInfo[0]['timezone'])
                        .format());
                    const [day, month, year, hour, minute] = [
                        date.getDate(),
                        date.getMonth() + 1,
                        date.getFullYear(),
                        date.getHours(),
                        date.getMinutes(),
                    ];
                    const editedEmbed = new discord_js_1.MessageEmbed()
                        .setColor('#3a9ce2')
                        .setTitle(value['name'])
                        .setDescription(`>>> ${value['description']}`)
                        .addFields([
                        {
                            name: 'Team Leader',
                            value: interaction.user.tag,
                        },
                        {
                            name: 'Event Name',
                            value: eventInfo[0]['eventName'],
                        },
                        {
                            name: 'Event Date and Time',
                            value: `<t:${moment_timezone_1.default
                                .tz(`${day}/${month}/${year} ${hour}:${minute}`, 'DD/MM/YYYY hh:mm', eventInfo[0]['timezone'])
                                .unix()}:F>`,
                        },
                        {
                            name: `Registered players ${numRegisteredPlayers}/${eventInfo[0]['maxNumTeamPlayers']}`,
                            value: registeredPlayers.value.length <= 0
                                ? ' '
                                : registeredPlayers.value,
                        },
                    ])
                        .setFooter({
                        text: `Team ID: ${value['id']} Event ID: ${eventId}`,
                    });
                    await fetchedMessage.edit({
                        embeds: [editedEmbed],
                    });
                }
            }
        }
    }
    catch (err) {
        try {
            fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in modalFunctions/teamEvent/utils/updateAllTeamInfo.ts \n Actual error: ${err} \n \n`, (err) => {
                if (err)
                    throw err;
            });
        }
        catch (err) {
            console.log('Error logging failed');
        }
    }
};
exports.default = updateAllTeamInfo;
