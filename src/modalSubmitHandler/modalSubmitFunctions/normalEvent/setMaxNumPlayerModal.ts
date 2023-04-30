import fs from 'fs';

import { Client, ModalSubmitInteraction, MessageEmbed } from 'discord.js';

import { ModalFunction } from '../../ModalSubmitStructure';
import { setColumnValue } from '../../../supabase/supabaseFunctions/events';

const setMaxNumPlayerModal: ModalFunction = {
	customId: 'maxNumPlayerModalSubmit',
	run: async (client: Client, interaction: ModalSubmitInteraction) => {
		try {
			const eventId: string | any =
				interaction.message?.embeds[0].footer?.text.split(': ')[1];

			const maxNumPlayer: string =
				interaction.fields.getTextInputValue('maxNumPlayerInput');

			setColumnValue({
				data: [
					{
						key: 'maxNumPlayer',
						value: parseInt(maxNumPlayer),
						id: parseInt(eventId),
					},
				],
			});

			interaction.message?.embeds[0].fields?.find((r) => {
				if (r.name.includes('Registered players')) {
					const numRegisteredPlayers = r.name.split(' ')[2].split('/')[0];
					r.name = `Registered players ${numRegisteredPlayers}/${maxNumPlayer}`;
					r.value = ' ';
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

export default setMaxNumPlayerModal;
