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
			const modal = new Modal()
				.setCustomId('myModal')
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

			await interaction.showModal(modal);

			client.on('interactionCreate', async (interaction) => {
				if (!interaction.isModalSubmit()) return;

				if (interaction.customId === 'myModal') {
					const eventName: string | any =
						interaction.fields.getTextInputValue('eventName');
					const gameName: string | any =
						interaction.fields.getTextInputValue('gameName');
					const description: string | any =
						interaction.fields.getTextInputValue('eventDescription');

					const playerNames: String[] = [
						'Adam',
						'Farhaan',
						'mz10ah',
						'Rehan',
					];

					let registeredPlayerNames: string = '>>> ';

					playerNames.forEach((player) => {
						registeredPlayerNames = registeredPlayerNames + player + '\n';
					});

					const eventEmbed = new MessageEmbed()
						.setColor('#3a9ce2')
						.setTitle(eventName)
						.setDescription(
							`**----------------------------------------** \n **Event description:** \n \n >>> ${description}  \n \n`,
						)
						.addField('Event time & date', '`24/03/2022`', true)
						.addField('Game name', gameName, true)
						.addField('Hosted by', `mz10ah#0054`)
						.addField('Registered players', `${registeredPlayerNames}`);

					await interaction.reply({
						embeds: [eventEmbed],
					});
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
