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
import moment from 'moment';
import momentTimzone from 'moment-timezone';
// import dayjs from 'dayjs';

import { Command } from '../CommandStructure';
// import timezone from '../../resources/timezone';
// import botConfig from '../../botConfig/botConfig.json';

const createCustoms: Command = {
	name: 'createcustoms',
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
			let eventDateTime: string | any;
			let description: string | any;

			let registeredPlayerNamesList: string[] = [];
			let registeredPlayerNames: string = '>>>  ';
			let eventEmbed = new MessageEmbed();

			/* modal */
			const modal = new Modal()
				.setCustomId(modalId)
				.setTitle('Create Customs event');

			const eventNameInput = new TextInputComponent()
				.setCustomId('eventName')
				.setLabel('Event name')
				.setStyle('SHORT');

			const gameNameInput = new TextInputComponent()
				.setCustomId('gameName')
				.setLabel('Game name')
				.setStyle('SHORT');

			const eventDateTimeInput = new TextInputComponent()
				.setCustomId('date')
				.setLabel('Date (format: DD/MM/YYYY hour:minute)')
				.setStyle('SHORT');

			const eventDescriptionInput = new TextInputComponent()
				.setCustomId('eventDescription')
				.setLabel('Event description')
				.setStyle('PARAGRAPH');

			const eventNameActionRow =
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					eventNameInput,
				);

			const gameNameActionRow =
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					gameNameInput,
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
				eventDateTimeActionRow,
				eventDescriptionActionRow,
			);

			/* buttons */
			const buttons = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId(registerBtnId)
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
						// .addField(
						// 	'Event date & time',
						// 	`<t:${moment(
						// 		eventDateTime,
						// 		'DD/MM/YYYY hh:mm',
						// 	).unix()}:F>`,
						// 	true,
						// )
						.addField(
							'Event date & time',
							`<t:${momentTimzone
								.tz(
									eventDateTime,
									'DD/MM/YYYY hh:mm',
									'America/Toronto',
								)
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
						// registeredPlayerNames =
						// 	registeredPlayerNames + i.user.tag + '\n';

						// check whether if the user is registed/already in the list
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
			console.log({
				actualError: err,
				message: 'Something went wrong in createCustoms.ts',
			});
		}
	},
};

export default createCustoms;
