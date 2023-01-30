import fs from 'fs';

import {
	BaseCommandInteraction,
	Client,
	Constants,
	MessageEmbed,
	MessageSelectMenu,
	MessageAttachment,
	MessageActionRow,
	MessageButton,
	Modal,
	TextInputComponent,
	ModalActionRowComponent,
	Message,
} from 'discord.js';
import momentTimzone from 'moment-timezone';
// import dayjs from 'dayjs';

import infoMessageEmbed from '../../globalUtils/infoMessageEmbed';
import { Command } from '../CommandStructure';
// import timezone from '../../resources/timezone';
// import botConfig from '../../botConfig/botConfig.json';

const createEvent: Command = {
	name: 'createevent',
	description: 'Create customs event',
	type: 'CHAT_INPUT',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			const modalId: string = `myModal-${interaction.id}`;
			const registerBtnId: string = `registerBtn-${interaction.id}`;
			const unregisterBtnId: string = `unregisterBtn-${interaction.id}`;

			let message: Message;

			let eventName: string | any;
			let gameName: string | any;
			let timezone: string | any;
			let eventDateTime: string | any;
			let description: string | any;

			let registeredPlayerNamesList: string[] = [];
			let registeredPlayerNames: string = ' ';
			let eventEmbed = new MessageEmbed();

			/* modal */
			const modal = new Modal()
				.setCustomId(modalId)
				.setTitle('Create Customs Event');

			const eventNameInput = new TextInputComponent()
				.setCustomId('eventName')
				.setLabel('Event name')
				.setStyle('SHORT')
				.setPlaceholder('Event name');

			const gameNameInput = new TextInputComponent()
				.setCustomId('gameName')
				.setLabel('Game name')
				.setStyle('SHORT')
				.setPlaceholder('Game name');

			const eventDateTimeInput = new TextInputComponent()
				.setCustomId('date')
				.setLabel('Date (format: DD/MM/YYYY hour:minute)')
				.setStyle('SHORT')
				.setPlaceholder('Event date');

			const eventTimezoneInput = new TextInputComponent()
				.setCustomId('timezone')
				.setLabel('Your timezone: timezones.etourne.xyz')
				.setStyle('SHORT')
				.setPlaceholder('Your timezone');

			const eventDescriptionInput = new TextInputComponent()
				.setCustomId('eventDescription')
				.setLabel('Event description')
				.setStyle('PARAGRAPH')
				.setPlaceholder('Event description');

			const eventNameActionRow =
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					eventNameInput,
				);

			const gameNameActionRow =
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					gameNameInput,
				);

			const eventTimezoneActionRow =
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					eventTimezoneInput,
				);

			const eventDateTimeActionRow =
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					eventDateTimeInput,
				);

			const eventDescriptionActionRow =
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					eventDescriptionInput,
				);

			modal.addComponents(
				eventNameActionRow,
				gameNameActionRow,
				eventTimezoneActionRow,
				eventDateTimeActionRow,
				eventDescriptionActionRow,
			);

			/* buttons */
			const buttons = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId('register')
					.setLabel('Register')
					.setStyle('PRIMARY'),
				new MessageButton()
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
							`<t:${momentTimzone
								.tz(eventDateTime, 'DD/MM/YYYY hh:mm', timezone)
								.unix()}:F>`,
							true,
						)
						.addField('Game name', gameName, true)
						.addField('Hosted by', `${interaction.user.tag}`)
						.addField('Registered players', ` ${registeredPlayerNames}`);

					if (!i.inCachedGuild()) return;

					message = await i.reply({
						embeds: [eventEmbed],
						components: [buttons],
						fetchReply: true,
					});
				} else if (i.isButton()) {
					if (i.customId === unregisterBtnId) {
						// check whether if the user is registered/in the list
						if (!registeredPlayerNamesList.includes(i.user.tag)) {
							i.reply({
								content: 'You are not registered!',
								ephemeral: true,
							});

							return;
						}

						const userIndex: number = registeredPlayerNamesList.indexOf(
							i.user.tag,
						);

						if (userIndex > -1) {
							registeredPlayerNamesList.splice(userIndex, 1);
						}

						registeredPlayerNames = '';
						registeredPlayerNamesList.forEach((player) => {
							registeredPlayerNames =
								registeredPlayerNames + player + '\n';
						});

						eventEmbed.fields[3].value =
							registeredPlayerNames.length > 0
								? '>>> ' + registeredPlayerNames
								: ' ';

						await message.edit({ embeds: [eventEmbed] });

						i.reply({
							content: `You have been unregistered from the event \`${eventName}\``,
							ephemeral: true,
						});
					}
				}
			});
		} catch (err) {
			interaction.reply({
				embeds: [infoMessageEmbed(':x: There has been an error', 'ERROR')],
			});

			try {
				fs.appendFile(
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

export default createEvent;
