import fs from 'fs';

import {
	Client,
	ModalSubmitInteraction,
	MessageEmbed,
	MessageButton,
	MessageActionRow,
} from 'discord.js';

import { ModalFunction } from '../../ModalSubmitStructure';

const setTeamNumLimitModal: ModalFunction = {
	customId: 'teamNumLimitModalSubmit',
	run: async (client: Client, interaction: ModalSubmitInteraction) => {
		try {
			const eventId: string | any =
				interaction.message?.embeds[0].footer?.text.split(': ')[1];

			const teamNumLimit: string =
				interaction.fields.getTextInputValue('teamNumLimit');

			interaction.message?.embeds[0].fields?.find((r) => {
				if (r.name === 'Num of team limit') {
					r.value = teamNumLimit;
				}
			});

			const editedEmbed = new MessageEmbed()
				.setColor('#3a9ce2')
				.setTitle(interaction.message?.embeds[0].title || 'Undefined')
				.setDescription(
					interaction.message?.embeds[0].description || 'Undefined',
				)
				.addFields(interaction.message?.embeds[0].fields || [])
				.setFooter({ text: `Event ID: ${eventId}` });

			return await interaction.update({ embeds: [editedEmbed] });
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in modalFunctions/teamEvent/teamNumLimitModalSubmit.ts \n Actual error: ${err} \n \n`,
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

export default setTeamNumLimitModal;
