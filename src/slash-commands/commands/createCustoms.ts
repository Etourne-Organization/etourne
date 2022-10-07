import {
	BaseCommandInteraction,
	Client,
	Constants,
	MessageEmbed,
	MessageAttachment,
	MessageActionRow,
	MessageButton,
	Modal,
	TextInputComponent,
	ModalActionRowComponent,
	Message,
} from 'discord.js';

import { Command } from '../CommandStructure';
import botConfig from '../../botConfig/botConfig.json';

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

			const eventDescriptionActionRow =
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					eventDescriptionInput,
				);

			modal.addComponents(
				eventNameActionRow,
				gameNameActionRow,
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
				const playerNames: String[] = [
					'Adam',
					'Farhaan',
					'mz10ah',
					'Rehan',
				];

				if (i.isModalSubmit() && i.customId === modalId) {
					eventName = i.fields.getTextInputValue('eventName');
					gameName = i.fields.getTextInputValue('gameName');
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
						.addField('Event time & date', '`24/03/2022`', true)
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

						// check whether if the user is already in the list/registered
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
						i.reply({
							content: unregisterBtnId,
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
