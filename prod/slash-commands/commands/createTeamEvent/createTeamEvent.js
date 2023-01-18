"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const infoMessageEmbed_1 = tslib_1.__importDefault(require("../../../globalUtils/infoMessageEmbed"));
const createTeamEvent = {
    name: 'createteamevent',
    description: 'Create team event',
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'numteamlimit',
            description: 'Num of team. Defaults to unlimited',
            type: discord_js_1.Constants.ApplicationCommandOptionTypes.INTEGER,
            required: false,
        },
        {
            name: 'numteammemberlimit',
            description: 'Num of team member. Defaults to unlimited',
            type: discord_js_1.Constants.ApplicationCommandOptionTypes.INTEGER,
            required: false,
        },
    ],
    run: async (client, interaction) => {
        try {
            const modalId = `myModal-${interaction.id}`;
            const createTeamBtnId = `createTeamBtn-${interaction.id}`;
            let message;
            let eventName;
            let gameName;
            let timezone;
            let eventDateTime;
            let numTeamLimit = interaction.options.get('numteamlimit');
            let numTeamMemberLimit = interaction.options.get('numteammemberlimit');
            let description;
            let registeredPlayerNamesList = [];
            let registeredPlayerNames = '>>>  ';
            let eventEmbed = new discord_js_1.MessageEmbed();
            const modal = new discord_js_1.Modal()
                .setCustomId(modalId)
                .setTitle('Create Team Event');
            const eventNameInput = new discord_js_1.TextInputComponent()
                .setCustomId('eventName')
                .setLabel('Event name')
                .setStyle('SHORT')
                .setPlaceholder('Event name');
            const gameNameInput = new discord_js_1.TextInputComponent()
                .setCustomId('gameName')
                .setLabel('Game name')
                .setStyle('SHORT')
                .setPlaceholder('Game name');
            const eventDateTimeInput = new discord_js_1.TextInputComponent()
                .setCustomId('date')
                .setLabel('Date (format: DD/MM/YYYY hour:minute)')
                .setStyle('SHORT')
                .setPlaceholder('Event date');
            const eventTimezoneInput = new discord_js_1.TextInputComponent()
                .setCustomId('timezone')
                .setLabel('Your timezone: et-timezones.vercel.app')
                .setStyle('SHORT')
                .setPlaceholder('Your timezone');
            const eventDescriptionInput = new discord_js_1.TextInputComponent()
                .setCustomId('eventDescription')
                .setLabel('Event description')
                .setStyle('PARAGRAPH')
                .setPlaceholder('Event description');
            const eventNameActionRow = new discord_js_1.MessageActionRow().addComponents(eventNameInput);
            const gameNameActionRow = new discord_js_1.MessageActionRow().addComponents(gameNameInput);
            const eventTimezoneActionRow = new discord_js_1.MessageActionRow().addComponents(eventTimezoneInput);
            const eventDateTimeActionRow = new discord_js_1.MessageActionRow().addComponents(eventDateTimeInput);
            const eventDescriptionActionRow = new discord_js_1.MessageActionRow().addComponents(eventDescriptionInput);
            modal.addComponents(eventNameActionRow, gameNameActionRow, eventTimezoneActionRow, eventDateTimeActionRow, eventDescriptionActionRow);
            const buttons = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                .setCustomId(createTeamBtnId)
                .setLabel('Create Team')
                .setStyle('PRIMARY'));
            await interaction.showModal(modal);
            client.on('interactionCreate', async (i) => {
                if (i.isModalSubmit() && i.customId === modalId) {
                    eventName = i.fields.getTextInputValue('eventName');
                    gameName = i.fields.getTextInputValue('gameName');
                    timezone = i.fields.getTextInputValue('timezone');
                    eventDateTime = i.fields.getTextInputValue('date');
                    description = i.fields.getTextInputValue('eventDescription');
                    eventEmbed
                        .setColor('#3a9ce2')
                        .setTitle(eventName)
                        .setDescription(`**----------------------------------------** \n **Event description:** \n \n >>> ${description}  \n \n`)
                        .addField('Event date & time', `<t:${moment_timezone_1.default
                        .tz(eventDateTime, 'DD/MM/YYYY hh:mm', timezone)
                        .unix()}:F>`, true)
                        .addField('Game name', gameName, true)
                        .addField('Num of team limit', numTeamLimit ? `${numTeamLimit.value}` : 'Unlimited')
                        .addField('Num of team member limit', numTeamMemberLimit
                        ? `${numTeamMemberLimit.value}`
                        : 'Unlimited')
                        .addField('Hosted by', `${interaction.user.tag}`);
                    if (!i.inCachedGuild())
                        return;
                    message = await i.channel?.send({
                        embeds: [eventEmbed],
                        components: [buttons],
                    });
                    i.reply({
                        embeds: [
                            (0, infoMessageEmbed_1.default)(':white_check_mark: Team Event Created Successfully'),
                        ],
                        ephemeral: true,
                    });
                }
            });
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
