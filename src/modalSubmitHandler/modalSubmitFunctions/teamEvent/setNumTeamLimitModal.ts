import fs from 'fs';

import {
	Client,
	ModalSubmitInteraction,
	MessageEmbed,
	Message,
} from 'discord.js';

import { ModalFunction } from '../../ModalSubmitStructure';
import { setColumnValue } from '../../../supabase/supabaseFunctions/events';
import { getNumOfTeams } from '../../../supabase/supabaseFunctions/teams';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';

const setNumTeamLimitModal: ModalFunction = {
	customId: 'numTeamLimitModalSubmit',
	run: async (client: Client, interaction: ModalSubmitInteraction) => {
		try {
			const eventId: string | any =
				interaction.message?.embeds[0].footer?.text.split(': ')[1];

			const numTeamLimit: string =
				interaction.fields.getTextInputValue('numTeamLimit');

			const numOfTeams: number = await getNumOfTeams({ eventId: eventId });

			if (numOfTeams > parseInt(numTeamLimit)) {
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
						key: 'numTeamLimit',
						value: numTeamLimit,
						id: parseInt(eventId),
					},
				],
			});

			interaction.message?.embeds[0].fields?.find((r) => {
				if (r.name === 'Num of team limit') {
					r.value = numTeamLimit;
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

export default setNumTeamLimitModal;
