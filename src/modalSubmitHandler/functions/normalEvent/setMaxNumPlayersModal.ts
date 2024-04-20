import { Client, ModalSubmitInteraction, MessageEmbed } from 'discord.js';

import logFile from '../../../globalUtils/logFile';
import { ModalSubmit } from '../../ModalSubmit';
import { setColumnValue } from '../../../supabase/supabaseFunctions/events';
import errorMessageTemplate from '../../../globalUtils/errorMessageTemplate';
import infoMessageEmbed, { types } from '../../../globalUtils/infoMessageEmbed';
import botConfig from '../../../botConfig';

const setMaxNumPlayersModal: ModalSubmit = {
	customId: 'maxNumPlayersModalSubmit',
	run: async (client: Client, interaction: ModalSubmitInteraction) => {
		try {
			await interaction.deferUpdate();

			const eventId: string | any =
				interaction.message?.embeds[0].footer?.text.split(': ')[1];

			const maxNumPlayers: string =
				interaction.fields.getTextInputValue('maxNumPlayersInput');

			setColumnValue({
				data: [
					{
						key: 'maxNumPlayers',
						value: parseInt(maxNumPlayers),
						id: parseInt(eventId),
					},
				],
			});

			interaction.message?.embeds[0].fields?.find((r) => {
				if (r.name.includes('Registered players')) {
					const numRegisteredPlayers = r.name.split(' ')[2].split('/')[0];
					r.name = `Registered players ${numRegisteredPlayers}/${maxNumPlayers}`;

					if (!r.value) {
						r.value = ' ';
					}
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
						title: ':white_check_mark: Max num of players set successfully!',
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
				file: 'normalEvent/setMaxNumPlayersModal',
			});
		}
	},
};

export default setMaxNumPlayersModal;
