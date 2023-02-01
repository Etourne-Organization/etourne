import fs from 'fs';

import {
	Client,
	ModalSubmitInteraction,
	MessageEmbed,
	MessageButton,
	MessageActionRow,
} from 'discord.js';

import { ModalFunction } from '../../ModalSubmitStructure';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';

const teamModal: ModalFunction = {
	customId: 'teamModalSubmit',
	run: async (client: Client, interaction: ModalSubmitInteraction) => {
		try {
			const eventName: any = interaction.message?.embeds[0].title;
			const eventDateTime: any = interaction.message?.embeds[0].fields?.find(
				(r) => r.name === 'Event date & time',
			)?.value;

			const teamName: string =
				interaction.fields.getTextInputValue('teamName');
			const teamShortDescription: string =
				interaction.fields.getTextInputValue('teamShortDescription');

			const buttons = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId('registerTeamMember')
					.setLabel('Register')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('unregisterTeamMember')
					.setLabel('Unregister')
					.setStyle('DANGER'),
			);

			const teamEmbed = new MessageEmbed()
				.setColor('#3a9ce2')
				.setTitle(teamName)
				.setDescription(`>>> ${teamShortDescription}`)
				.addField('Team Leader', `${interaction.user.tag}`)
				.addField('Event Name', `${eventName}`)
				.addField('Event Date and Time', `${eventDateTime}`)
				.addField('Registered players', ` `);

			interaction.reply({
				embeds: [teamEmbed],
				components: [buttons],
			});
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in modalFunctions/teamEvent/teamModal.ts \n Actual error: ${err} \n \n`,
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

export default teamModal;
