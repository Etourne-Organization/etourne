import { Client, ModalSubmitInteraction, MessageEmbed } from 'discord.js';

import logFile from '../../../globalUtils/logFile';
import { ModalSubmit } from '../../ModalSubmit';
import { setColumnValue } from '../../../supabase/supabaseFunctions/events';
import updateAllTeamInfo from './utilities/updateAllTeamInfo';
import errorMessageTemplate from '../../../globalUtils/errorMessageTemplate';
import infoMessageEmbed, { types } from '../../../globalUtils/infoMessageEmbed';
import botConfig from '../../../botConfig';

const setMaxNumTeamPlayersModal: ModalSubmit = {
	customId: 'setMaxNumTeamPlayersModalSubmit',
	run: async (client: Client, interaction: ModalSubmitInteraction) => {
		try {
			await interaction.deferUpdate();

			const eventId: string | any =
				interaction.message?.embeds[0].footer?.text.split(': ')[1];

			const maxNumTeamPlayers: string =
				interaction.fields.getTextInputValue('maxNumTeamPlayers');

			setColumnValue({
				data: [
					{
						key: 'maxNumTeamPlayers',
						value: parseInt(maxNumTeamPlayers),
						id: parseInt(eventId),
					},
				],
			});

			interaction.message?.embeds[0].fields?.find((r) => {
				if (r.name === 'Max num of team players') {
					r.value = maxNumTeamPlayers;
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

			updateAllTeamInfo({ eventId: eventId, interaction: interaction });

			await interaction.editReply({ embeds: [editedEmbed] });

			return await interaction.followUp({
				embeds: [
					infoMessageEmbed({
						title: ':white_check_mark: Max num of team players set successfully!',
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
				file: 'teamEvent/setMaxNumTeamPlayersModal',
			});
		}
	},
};

export default setMaxNumTeamPlayersModal;
