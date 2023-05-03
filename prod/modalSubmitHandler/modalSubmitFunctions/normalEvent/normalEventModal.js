"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const infoMessageEmbed_1 = tslib_1.__importDefault(require("../../../globalUtils/infoMessageEmbed"));
const events_1 = require("../../../supabase/supabaseFunctions/events");
const normalEventModal = {
    customId: 'normalEventModalSubmit',
    run: async (client, interaction) => {
        try {
            const eventName = interaction.fields.getTextInputValue('eventName');
            const gameName = interaction.fields.getTextInputValue('gameName');
            const timezone = interaction.fields.getTextInputValue('timezone');
            const eventDateTime = interaction.fields.getTextInputValue('date');
            const description = interaction.fields.getTextInputValue('eventDescription');
            const eventEmbed = new discord_js_1.MessageEmbed()
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
                { name: 'Hosted by', value: `${interaction.user.tag}` },
                { name: `Registered players 0/unlimited`, value: ` ` },
            ]);
            const buttons = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                .setCustomId('normalEventRegister')
                .setLabel('Register')
                .setStyle('PRIMARY'), new discord_js_1.MessageButton()
                .setCustomId('normalEventUnregister')
                .setLabel('Unregister')
                .setStyle('DANGER'));
            const managePlayerButtons = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                .setCustomId('setMaxNumPlayers')
                .setLabel('Set max num of players')
                .setStyle('SECONDARY'), new discord_js_1.MessageButton()
                .setCustomId('removePlayer')
                .setLabel('❌  Remove player')
                .setStyle('SECONDARY'));
            const manageEventButtons = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                .setCustomId('editEventInfo')
                .setLabel('⚙️  Edit event info')
                .setStyle('SECONDARY'), new discord_js_1.MessageButton()
                .setCustomId('deleteEvent')
                .setLabel('🗑️  Delete event')
                .setStyle('DANGER'));
            if (!interaction.inCachedGuild())
                return;
            const id = await (0, events_1.addEvent)({
                eventName: eventName,
                gameName: gameName,
                description: description,
                dateTime: new Date(moment_timezone_1.default
                    .tz(eventDateTime, 'DD/MM/YYYY hh:mm', timezone)
                    .format()).toISOString(),
                isTeamEvent: false,
                discordServerId: interaction.guild.id,
                timezone: timezone,
                serverName: interaction.guild.name,
                eventHost: interaction.user.tag,
            });
            eventEmbed.setFooter({
                text: `Event ID: ${id}`,
            });
            const reply = await interaction.channel?.send({
                embeds: [eventEmbed],
                components: [buttons, managePlayerButtons, manageEventButtons],
            });
            await (0, events_1.setColumnValue)({
                data: [
                    {
                        id: id,
                        key: 'messageId',
                        value: reply.id,
                    },
                ],
            });
            await interaction.reply({
                embeds: [
                    (0, infoMessageEmbed_1.default)(':white_check_mark: Event Created Successfully', 'SUCCESS'),
                ],
                ephemeral: true,
            });
        }
        catch (err) {
            console.log(err);
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in modalFunctions/normalEvent/normalEventModal.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = normalEventModal;
