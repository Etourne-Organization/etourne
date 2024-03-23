import fs from 'fs';

import {
	Client,
	ModalSubmitInteraction,
	MessageEmbed,
	Message,
} from 'discord.js';

import { ModalSubmit } from '../../ModalSubmit';
import { setColumnValue } from '../../../supabase/supabaseFunctions/events';
import { getNumOfTeams } from '../../../supabase/supabaseFunctions/teams';
import errorMessageTemplate from '../../../globalUtils/errorMessageTemplate';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';

const setMaxNumTeamsModal: ModalSubmit = {
	customId: 'setMaxNumTeamsModalSubmit',
	run: async (client: Client, interaction: ModalSubmitInteraction) => {
		try {
			const eventId: string | any =
				interaction.message?.embeds[0].footer?.text.split(': ')[1];

			const maxNumTeams: string =
				interaction.fields.getTextInputValue('maxNumTeams');

			const numOfTeams: number = await getNumOfTeams({ eventId: eventId });

			if (numOfTeams > parseInt(maxNumTeams)) {
				const replyEmbed: MessageEmbed = new MessageEmbed()
					.setColor('#D83C3E')
					.setTitle(
						':x: Number of registered teams is more than the new limit',
					)
					.setDescription(
						'Decrease the number of registered teams to set a lower limit than the present value',
					)
					.setTimestamp();

				return await interaction.reply({
					embeds: [replyEmbed],
					ephemeral: true,
				});
			}

			setColumnValue({
				data: [
					{
						key: 'maxNumTeams',
						value: parseInt(maxNumTeams),
						id: parseInt(eventId),
					},
				],
			});

			interaction.message?.embeds[0].fields?.find((r) => {
				if (r.name === 'Max num of teams') {
					r.value = maxNumTeams;
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
			await interaction.reply({
				embeds: [
					infoMessageEmbed(
						errorMessageTemplate().title,
						'ERROR',
						errorMessageTemplate().description,
					),
				],
				ephemeral: true,
			});

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

export default setMaxNumTeamsModal;
