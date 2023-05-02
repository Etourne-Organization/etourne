import fs from 'fs';

import {
	Client,
	ButtonInteraction,
	Modal,
	TextInputComponent,
	MessageActionRow,
	ModalActionRowComponent,
} from 'discord.js';
import momentTimezone from 'moment-timezone';

import { ButtonFunction } from '../../ButtonStructure';
import { getAllColumnValueById } from '../../../supabase/supabaseFunctions/events';
import { getUserRole } from '../../../supabase/supabaseFunctions/users';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';

const editEventInfo: ButtonFunction = {
	customId: 'editEventInfo',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			// check user role in DB
			const userRoleDB: any = await getUserRole({
				discordUserId: interaction.user.id,
				discordServerId: interaction.guild!.id,
			});

			if (
				userRoleDB.length === 0 ||
				(userRoleDB[0]['roleId'] !== 3 && userRoleDB[0]['roleId'] !== 2)
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

			const eventId: string | any =
				interaction.message.embeds[0].footer?.text.split(': ')[1];

			const allColumnValue = await getAllColumnValueById({ id: eventId });

			const date = new Date(
				momentTimezone
					.tz(allColumnValue[0]['dateTime'], allColumnValue[0]['timezone'])
					.format(),
			);

			const [day, month, year, hour, minute] = [
				date.getDate(),
				date.getMonth() + 1,
				date.getFullYear(),
				date.getHours(),
				date.getMinutes(),
			];

			const modal = new Modal()
				.setCustomId(`editEventInfoModal-${interaction.id}`)
				.setTitle('Edit event');

			const eventNameInput = new TextInputComponent()
				.setCustomId('eventName')
				.setLabel('Event name')
				.setStyle('SHORT')
				.setPlaceholder('Event name')
				.setValue(allColumnValue[0]['eventName']);

			const gameNameInput = new TextInputComponent()
				.setCustomId('gameName')
				.setLabel('Game name')
				.setStyle('SHORT')
				.setPlaceholder('Game name')
				.setValue(allColumnValue[0]['gameName']);

			const eventDateTimeInput = new TextInputComponent()
				.setCustomId('date')
				.setLabel('Date (format: DD/MM/YYYY hour:minute)')
				.setStyle('SHORT')
				.setPlaceholder('Event date')
				.setValue(`${day}/${month}/${year} ${hour}:${minute}`);

			const eventTimezoneInput = new TextInputComponent()
				.setCustomId('timezone')
				.setLabel('Your timezone: timezones.etourne.xyz')
				.setStyle('SHORT')
				.setPlaceholder('Your timezone')
				.setValue(allColumnValue[0]['timezone']);

			const eventDescriptionInput = new TextInputComponent()
				.setCustomId('eventDescription')
				.setLabel('Event description')
				.setStyle('PARAGRAPH')
				.setPlaceholder('Event description')
				.setValue(allColumnValue[0]['description']);

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
			try {
				console.log(err);
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in buttonFunctions/normalEvent/editEventInfo.ts \n Actual error: ${err} \n \n`,
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

export default editEventInfo;
