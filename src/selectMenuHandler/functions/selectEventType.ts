import {
	Client,
	SelectMenuInteraction,
	MessageActionRow,
	Modal,
	TextInputComponent,
	ModalActionRowComponent,
	MessageEmbed,
} from 'discord.js';

import logFile from '../../globalUtils/logFile';
import { SelectMenu } from '../SelectMenu';

const selectEventType: SelectMenu = {
	customId: 'selectEventType',
	run: async (client: Client, interaction: SelectMenuInteraction) => {
		try {
			const eventType: string = interaction.values[0];

			/* modal */
			const modal = new Modal()
				.setCustomId(
					`${
						eventType === 'createEvent'
							? 'normalEventModalSubmit'
							: 'teamEventModalSubmit'
					}-${interaction.id}`,
				)
				.setTitle('Create Event');

			const eventNameInput = new TextInputComponent()
				.setCustomId('eventName')
				.setLabel('Event name')
				.setStyle('SHORT')
				.setPlaceholder('Event name')
				.setRequired(true);

			const gameNameInput = new TextInputComponent()
				.setCustomId('gameName')
				.setLabel('Game name')
				.setStyle('SHORT')
				.setPlaceholder('Game name')
				.setRequired(true);

			const eventDateTimeInput = new TextInputComponent()
				.setCustomId('dateTime')
				.setLabel('Date (format: DD/MM/YYYY HH:mm)')
				.setStyle('SHORT')
				.setPlaceholder('Event date and time')
				.setRequired(true);

			const eventTimezoneInput = new TextInputComponent()
				.setCustomId('timezone')
				.setLabel('Your timezone: timezones.etourne.com')
				.setStyle('SHORT')
				.setPlaceholder('Your timezone')
				.setRequired(true);

			const eventDescriptionInput = new TextInputComponent()
				.setCustomId('eventDescription')
				.setLabel('Event description')
				.setStyle('PARAGRAPH')
				.setPlaceholder('Event description')
				.setRequired(true);

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

			await interaction.showModal(modal);
		} catch (err) {
			logFile({
				error: err,
				folder: 'selectMenuHandler/functions',
				file: 'createEvent',
			});
		}
	},
};

export default selectEventType;
