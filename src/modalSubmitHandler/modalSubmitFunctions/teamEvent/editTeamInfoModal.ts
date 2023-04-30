import fs from 'fs';

import { Client, ModalSubmitInteraction, MessageEmbed } from 'discord.js';

import { ModalFunction } from '../../ModalSubmitStructure';
import { updateTeam } from '../../../supabase/supabaseFunctions/teams';

const editTeamInfoModal: ModalFunction = {
	customId: 'editTeamInfoModal',
	run: async (client: Client, interaction: ModalSubmitInteraction) => {
		try {
			const teamId: string | any =
				interaction.message?.embeds[0].footer?.text.split(' ')[2];
			const eventId: string | any =
				interaction.message?.embeds[0].footer?.text.split(' ')[5];

			const registeredPlayers:
				| {
						name: string;
						value: string;
						inline: boolean;
				  }
				| any = interaction.message?.embeds[0].fields?.find(
				(r) => r.name === 'Registered players',
			);

			const eventDateTime:
				| {
						name: string;
						value: string;
						inline: boolean;
				  }
				| any = interaction.message?.embeds[0].fields?.find((r) =>
				r.name.includes('Registered players'),
			);

			const eventName:
				| {
						name: string;
						value: string;
						inline: boolean;
				  }
				| any = interaction.message?.embeds[0].fields?.find(
				(r) => r.name === 'Event Name',
			);

			const teamName: string =
				interaction.fields.getTextInputValue('teamName');
			const teamShortDescription: string =
				interaction.fields.getTextInputValue('teamShortDescription');

			const editedEmbed = new MessageEmbed()
				.setColor('#3a9ce2')
				.setTitle(teamName)
				.setDescription(`>>> ${teamShortDescription}`)
				.addFields([
					{
						name: 'Team Leader',
						value: interaction.user.tag,
					},
					{
						name: 'Event Name',
						value: eventName.value,
					},
					{
						name: 'Event Date and Time',
						value: eventDateTime.value,
					},
					{
						name: registeredPlayers.name,
						value:
							registeredPlayers.value.length <= 0
								? ' '
								: registeredPlayers.value,
					},
				])
				.setFooter({
					text: `Team ID: ${teamId} Event ID: ${eventId}`,
				});

			if (!interaction.inCachedGuild()) return;

			await updateTeam({
				id: teamId,
				teamName: teamName,
				teamDescription: teamShortDescription,
			});

			return await interaction.update({
				embeds: [editedEmbed],
			});
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in modalFunctions/teamEvent/editTeamInfoModal.ts \n Actual error: ${err} \n \n`,
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

export default editTeamInfoModal;
