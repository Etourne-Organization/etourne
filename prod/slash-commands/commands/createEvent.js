'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const fs_1 = tslib_1.__importDefault(require('fs'));
const discord_js_1 = require('discord.js');
const moment_timezone_1 = tslib_1.__importDefault(require('moment-timezone'));
const createEvent = {
	name: 'createevent',
	description: 'Create customs event',
	type: 'CHAT_INPUT',
	run: async (client, interaction) => {
		try {
			const modalId = `myModal-${interaction.id}`;
			const registerBtnId = `registerBtn-${interaction.id}`;
			const unregisterBtnId = `unregisterBtn-${interaction.id}`;
			let message;
			let eventName;
			let gameName;
			let timezone;
			let eventDateTime;
			let description;
			let registeredPlayerNamesList = [];
			let registeredPlayerNames = '>>>  ';
			let eventEmbed = new discord_js_1.MessageEmbed();
			const modal = new discord_js_1.Modal()
				.setCustomId(modalId)
				.setTitle('Create Customs event');
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
			const eventNameActionRow =
				new discord_js_1.MessageActionRow().addComponents(eventNameInput);
			const gameNameActionRow =
				new discord_js_1.MessageActionRow().addComponents(gameNameInput);
			const eventTimezoneActionRow =
				new discord_js_1.MessageActionRow().addComponents(
					eventTimezoneInput,
				);
			const eventDateTimeActionRow =
				new discord_js_1.MessageActionRow().addComponents(
					eventDateTimeInput,
				);
			const eventDescriptionActionRow =
				new discord_js_1.MessageActionRow().addComponents(
					eventDescriptionInput,
				);
			modal.addComponents(
				eventNameActionRow,
				gameNameActionRow,
				eventTimezoneActionRow,
				eventDateTimeActionRow,
				eventDescriptionActionRow,
			);
			const buttons = new discord_js_1.MessageActionRow().addComponents(
				new discord_js_1.MessageButton()
					.setCustomId(registerBtnId)
					.setLabel('Register')
					.setStyle('PRIMARY'),
				new discord_js_1.MessageButton()
					.setCustomId(unregisterBtnId)
					.setLabel('Unregister')
					.setStyle('DANGER'),
			);
			await interaction.showModal(modal);
			client.on('interactionCreate', async (i) => {
				if (i.isModalSubmit() && i.customId === modalId) {
					eventName = i.fields.getTextInputValue('eventName');
					gameName = i.fields.getTextInputValue('gameName');
					timezone = i.fields.getTextInputValue('timezone');
					eventDateTime = i.fields.getTextInputValue('date');
					description = i.fields.getTextInputValue('eventDescription');
					registeredPlayerNamesList.forEach((player) => {
						registeredPlayerNames =
							registeredPlayerNames + i.user.tag + '\n';
					});
					eventEmbed
						.setColor('#3a9ce2')
						.setTitle(eventName)
						.setDescription(
							`**----------------------------------------** \n **Event description:** \n \n >>> ${description}  \n \n`,
						)
						.addField(
							'Event date & time',
							`<t:${moment_timezone_1.default
								.tz(eventDateTime, 'DD/MM/YYYY hh:mm', timezone)
								.unix()}:F>`,
							true,
						)
						.addField('Game name', gameName, true)
						.addField('Hosted by', `${interaction.user.tag}`)
						.addField('Registered players', `${registeredPlayerNames}`);
					if (!i.inCachedGuild()) return;
					message = await i.reply({
						embeds: [eventEmbed],
						components: [buttons],
						fetchReply: true,
					});
				} else if (i.isButton()) {
					if (i.customId === registerBtnId) {
						if (registeredPlayerNamesList.includes(i.user.tag)) {
							i.reply({
								content: 'You are already registered!',
								ephemeral: true,
							});
							return;
						}
						registeredPlayerNamesList.push(i.user.tag);
						registeredPlayerNames = '>>>  ';
						registeredPlayerNamesList.forEach((player) => {
							registeredPlayerNames =
								registeredPlayerNames + player + '\n';
						});
						eventEmbed.fields[3].value = registeredPlayerNames;
						await message.edit({ embeds: [eventEmbed] });
						i.reply({
							content: `You have been registered for the event \`${eventName}\``,
							ephemeral: true,
						});
					}
					if (i.customId === unregisterBtnId) {
						if (!registeredPlayerNamesList.includes(i.user.tag)) {
							i.reply({
								content: 'You are not registered!',
								ephemeral: true,
							});
							return;
						}
						const userIndex = registeredPlayerNamesList.indexOf(
							i.user.tag,
						);
						if (userIndex > -1) {
							registeredPlayerNamesList.splice(userIndex, 1);
						}
						registeredPlayerNames = '>>>  ';
						registeredPlayerNamesList.forEach((player) => {
							registeredPlayerNames =
								registeredPlayerNames + player + '\n';
						});
						eventEmbed.fields[3].value = registeredPlayerNames;
						await message.edit({ embeds: [eventEmbed] });
						i.reply({
							content: `You have been unregistered from the event \`${eventName}\``,
							ephemeral: true,
						});
					}
				}
			});
		} catch (err) {
			try {
				fs_1.default.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in slashcommands/createEvent.ts \n Actual error: ${err} \n \n`,
					(err) => {
						if (err) throw err;
					},
				);
			} catch (err) {
				console.log('Error logging failed');
			}
		}
	},
};
exports.default = createEvent;
