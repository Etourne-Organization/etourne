import fs from 'fs';

import { Client, ModalSubmitInteraction, MessageEmbed } from 'discord.js';

import { ModalSubmit } from '../../ModalSubmit';
import { setColumnValue } from '../../../supabase/supabaseFunctions/events';
import updateAllTeamInfo from './utilities/updateAllTeamInfo';
import errorMessageTemplate from '../../../globalUtils/errorMessageTemplate';
import infoMessageEmbed, { types } from '../../../globalUtils/infoMessageEmbed';

const setMaxNumTeamPlayersModal: ModalSubmit = {
	customId: 'setMaxNumTeamPlayersModalSubmit',
	run: async (client: Client, interaction: ModalSubmitInteraction) => {
		try {
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
				.setColor('#3a9ce2')
				.setTitle(interaction.message?.embeds[0].title || 'Undefined')
				.setDescription(
					interaction.message?.embeds[0].description || 'Undefined',
				)
				.addFields(interaction.message?.embeds[0].fields || [])
				.setFooter({ text: `Event ID: ${eventId}` });

			updateAllTeamInfo({ eventId: eventId, interaction: interaction });

			return await interaction.update({ embeds: [editedEmbed] });
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
					`${new Date()} : Something went wrong in modalFunctions/teamEvent/teamMemberNumLimitModalSubmit.ts \n Actual error: ${err} \n \n`,
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

export default setMaxNumTeamPlayersModal;
