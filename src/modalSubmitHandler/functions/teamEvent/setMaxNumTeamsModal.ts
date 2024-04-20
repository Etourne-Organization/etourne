import { Client, ModalSubmitInteraction, MessageEmbed } from 'discord.js';

import logFile from '../../../globalUtils/logFile';
import { ModalSubmit } from '../../ModalSubmit';
import { setColumnValue } from '../../../supabase/supabaseFunctions/events';
import { getNumOfTeams } from '../../../supabase/supabaseFunctions/teams';
import errorMessageTemplate from '../../../globalUtils/errorMessageTemplate';
import infoMessageEmbed, { types } from '../../../globalUtils/infoMessageEmbed';
import botConfig from '../../../botConfig';

const setMaxNumTeamsModal: ModalSubmit = {
	customId: 'setMaxNumTeamsModalSubmit',
	run: async (client: Client, interaction: ModalSubmitInteraction) => {
		try {
			await interaction.deferUpdate();

			const eventId: string | any =
				interaction.message?.embeds[0].footer?.text.split(': ')[1];

			const maxNumTeams: string =
				interaction.fields.getTextInputValue('maxNumTeams');

			const numOfTeams: number = await getNumOfTeams({ eventId: eventId });

			if (numOfTeams > parseInt(maxNumTeams)) {
				const replyEmbed: MessageEmbed = new MessageEmbed()
					.setColor(botConfig.color.red)
					.setTitle(
						':x: Number of registered teams is more than the new limit',
					)
					.setDescription(
						'Decrease the number of registered teams to set a lower limit than the present value',
					)
					.setTimestamp();

				return await interaction.followUp({
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
				.setColor(botConfig.color.default)
				.setTitle(interaction.message?.embeds[0].title || 'Undefined')
				.setDescription(
					interaction.message?.embeds[0].description || 'Undefined',
				)
				.addFields(interaction.message?.embeds[0].fields || [])
				.setFooter({ text: `Event ID: ${eventId}` });

			await interaction.editReply({ embeds: [editedEmbed] });

			return await interaction.followUp({
				embeds: [
					infoMessageEmbed({
						title: ':white_check_mark: Max num of teams set successfully!',
						type: types.SUCCESS,
					}),
				],
				ephemeral: true,
			});
		} catch (err) {
			await interaction.followUp({
				embeds: [
					infoMessageEmbed({
						title: errorMessageTemplate().title,
						description: errorMessageTemplate().description,
						type: types.ERROR,
					}),
				],
				ephemeral: true,
			});

			logFile({
				error: err,
				folder: 'modalSubmitHandler/functions',
				file: 'teamEvent/setMaxNumTeamsModal',
			});
		}
	},
};

export default setMaxNumTeamsModal;
