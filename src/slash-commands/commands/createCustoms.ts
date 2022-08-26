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

			client.on('interactionCreate', async (interaction) => {
				const playerNames: String[] = [
					'Adam',
					'Farhaan',
					'mz10ah',
					'Rehan',
				];
				let registeredPlayerNames: string = '>>> ';
				let eventEmbed = new MessageEmbed();

				if (
					interaction.isModalSubmit() &&
					interaction.customId === modalId
				) {
					const eventName: string | any =
						interaction.fields.getTextInputValue('eventName');
					const gameName: string | any =
						interaction.fields.getTextInputValue('gameName');
					const description: string | any =
						interaction.fields.getTextInputValue('eventDescription');

					playerNames.forEach((player) => {
						registeredPlayerNames = registeredPlayerNames + player + '\n';
					});

					eventEmbed
						.setColor('#3a9ce2')
						.setTitle(eventName)
						.setDescription(
							`**----------------------------------------** \n **Event description:** \n \n >>> ${description}  \n \n`,
						)
						.addField('Event time & date', '`24/03/2022`', true)
						.addField('Game name', gameName, true)
						.addField('Hosted by', `mz10ah#0054`)
						.addField('Registered players', `${registeredPlayerNames}`);

					return interaction.reply({
						embeds: [eventEmbed],
						components: [buttons],
					});
				} else if (interaction.isButton()) {
					if (interaction.customId === registerBtnId) {
						console.log(registerBtnId);

						registeredPlayerNames =
							registeredPlayerNames + interaction.user.tag + '\n';

						interaction.reply({
							content: registerBtnId,
							ephemeral: true,
						});
					}

					if (interaction.customId === unregisterBtnId) {
						console.log(unregisterBtnId);

						interaction.reply({
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
