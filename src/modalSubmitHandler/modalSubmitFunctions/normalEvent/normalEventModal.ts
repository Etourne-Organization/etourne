import fs from 'fs';

import {
	Client,
	ModalSubmitInteraction,
	MessageEmbed,
	MessageButton,
	MessageActionRow,
} from 'discord.js';
import momentTimezone from 'moment-timezone';

import { ModalFunction } from '../../ModalSubmitStructure';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';
import {
	addEvent,
	setColumnValue,
} from '../../../supabase/supabaseFunctions/events';

const normalEventModal: ModalFunction = {
	customId: 'normalEventModalSubmit',
	run: async (client: Client, interaction: ModalSubmitInteraction) => {
		try {
			const eventName = interaction.fields.getTextInputValue('eventName');
			const gameName = interaction.fields.getTextInputValue('gameName');
			const timezone = interaction.fields.getTextInputValue('timezone');
			const eventDateTime = interaction.fields.getTextInputValue('date');
			const description =
				interaction.fields.getTextInputValue('eventDescription');

			const eventEmbed = new MessageEmbed()
				.setColor('#3a9ce2')
				.setTitle(eventName)
				.setDescription(
					`**----------------------------------------** \n **Event description:** \n \n >>> ${description}  \n \n`,
				)
				.addFields([
					{
						name: 'Event date & time',
						value: `<t:${momentTimezone
							.tz(eventDateTime, 'DD/MM/YYYY hh:mm', timezone)
							.unix()}:F>`,
						inline: true,
					},
					{ name: 'Game name', value: gameName, inline: true },
					{ name: 'Hosted by', value: `${interaction.user.tag}` },
					{ name: `Registered players 0/unlimited`, value: ` ` },
				]);

			/* buttons */
			const buttons = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId('normalEventRegister')
					.setLabel('Register')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('normalEventUnregister')
					.setLabel('Unregister')
					.setStyle('DANGER'),
			);

			const managePlayerButtons = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId('setMaxNumPlayer')
					.setLabel('Set max num of players')
					.setStyle('SECONDARY'),
				new MessageButton()
					.setCustomId('removePlayer')
					.setLabel('❌  Remove player')
					.setStyle('SECONDARY'),
			);

			const manageEventButtons = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId('editEventInfo')
					.setLabel('⚙️  Edit event info')
					.setStyle('SECONDARY'),
				new MessageButton()
					.setCustomId('deleteEvent')
					.setLabel('🗑️  Delete event')
					.setStyle('DANGER'),
			);

			if (!interaction.inCachedGuild()) return;

			const id = await addEvent({
				eventName: eventName,
				gameName: gameName,
				description: description,
				dateTime: new Date(
					momentTimezone
						.tz(eventDateTime, 'DD/MM/YYYY hh:mm', timezone)
						.format(),
				).toISOString(),
				isTeamEvent: false,
				discordServerId: interaction.guild.id,
				timezone: timezone,
				serverName: interaction.guild.name,
				eventHost: interaction.user.tag,
			});

			eventEmbed.setFooter({
				text: `Event ID: ${id}`,
			});

			const reply = await interaction.channel?.send({
				embeds: [eventEmbed],
				components: [buttons, managePlayerButtons, manageEventButtons],
			});

			await setColumnValue({
				data: [
					{
						id: id,
						key: 'messageId',
						value: reply!.id,
					},
				],
			});

			await interaction.reply({
				embeds: [
					infoMessageEmbed(
						':white_check_mark: Event Created Successfully',
						'SUCCESS',
					),
				],
				ephemeral: true,
			});
		} catch (err) {
			console.log(err);
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in modalFunctions/normalEvent/normalEventModal.ts \n Actual error: ${err} \n \n`,
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

export default normalEventModal;
