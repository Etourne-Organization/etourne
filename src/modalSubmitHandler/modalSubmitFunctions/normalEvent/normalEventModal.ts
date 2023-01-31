import fs from 'fs';

import {
	Client,
	ModalSubmitInteraction,
	MessageEmbed,
	MessageButton,
	MessageActionRow,
} from 'discord.js';
import momentTimzone from 'moment-timezone';

import { ModalFunction } from '../../ModalSubmitStructure';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';

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
				.addField(
					'Event date & time',
					`<t:${momentTimzone
						.tz(eventDateTime, 'DD/MM/YYYY hh:mm', timezone)
						.unix()}:F>`,
					true,
				)
				.addField('Game name', gameName, true)
				.addField('Hosted by', `${interaction.user.tag}`)
				.addField('Registered players', ` `);

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

			if (!interaction.inCachedGuild()) return;

			await interaction.channel?.send({
				embeds: [eventEmbed],
				components: [buttons],
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
