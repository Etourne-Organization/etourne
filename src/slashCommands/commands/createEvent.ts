import fs from 'fs';

import {
	BaseCommandInteraction,
	Client,
	MessageActionRow,
	Modal,
	TextInputComponent,
	ModalActionRowComponent,
	MessageEmbed,
} from 'discord.js';

import infoMessageEmbed, { types } from '../../globalUtils/infoMessageEmbed';
import { Command } from '../Command';
import { getUserRole } from '../../supabase/supabaseFunctions/users';
import { checkServerExists } from '../../supabase/supabaseFunctions/servers';
import commandIds from '../../commandIds';
import errorMessageTemplate from '../../globalUtils/errorMessageTemplate';

const createEvent: Command = {
	name: 'createevent',
	description: 'Create event',
	type: 'CHAT_INPUT',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			if (
				!(await checkServerExists({
					discordServerId: interaction.guild!.id,
				}))
			) {
				const embed = new MessageEmbed()
					.setColor('#D83C3E')
					.setTitle(':x: Error: Server not registered!')
					.setDescription(
						`Use </registerserver:${commandIds.REGISTER_SERVER}> command to register your server in Etourne database.`,
					)
					.setFooter({ text: 'Use /support to seek support if required.' })
					.setTimestamp();

				return await interaction.reply({
					embeds: [embed],
				});
			}

			// check user role in DB
			const userRoleDB: any = await getUserRole({
				discordUserId: interaction.user.id,
				discordServerId: interaction.guild!.id,
			});

			console.log(userRoleDB.length);

			if (
				userRoleDB.length === 0 ||
				(userRoleDB[0]['roleId'] !== 3 && userRoleDB[0]['roleId'] !== 2)
			) {
				return await interaction.reply({
					embeds: [
						infoMessageEmbed({
							title: ':warning: You are not allowed run this command!',
							type: types.ERROR,
						}),
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
			await interaction.reply({
				embeds: [
					infoMessageEmbed({
						title: errorMessageTemplate().title,
						description: errorMessageTemplate().description,
						type: types.ERROR,
					}),
				],
				ephemeral: true,
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
