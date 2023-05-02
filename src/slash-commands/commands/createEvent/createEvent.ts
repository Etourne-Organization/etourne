import fs from 'fs';

import {
	BaseCommandInteraction,
	Client,
	MessageActionRow,
	Modal,
	TextInputComponent,
	ModalActionRowComponent,
} from 'discord.js';

import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';
import { Command } from '../../CommandStructure';
import { getUserRole } from '../../../supabase/supabaseFunctions/users';
// import timezone from '../../resources/timezone';
// import botConfig from '../../botConfig/botConfig.json';

const createEvent: Command = {
	name: 'createevent',
	description: 'Create event',
	type: 'CHAT_INPUT',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			const userRoleDB: any = await getUserRole({
				discordUserId: interaction.user.id,
				discordServerId: interaction.guild!.id,
			});

			if (
				userRoleDB.length === 0 ||
				(userRoleDB[0]['roleId'] !== 4 && userRoleDB[0]['roleId'] !== 3)
			) {
				return await interaction.reply({
					embeds: [
						infoMessageEmbed(
							':warning: You are not allowed to run this command!',
							'WARNING',
						),
					],
					ephemeral: true,
				});
			}

			/* modal */
			const modal = new Modal()
				.setCustomId(`normalEventModalSubmit-${interaction.id}`)
				.setTitle('Create Event');

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

			await interaction.showModal(modal);
		} catch (err) {
			interaction.reply({
				embeds: [infoMessageEmbed(':x: There has been an error', 'ERROR')],
			});

			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in slashcommands/createEvent/createEvent.ts \n Actual error: ${err} \n \n`,
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
