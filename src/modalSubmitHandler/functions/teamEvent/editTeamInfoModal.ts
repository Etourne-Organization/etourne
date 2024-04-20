import { Client, ModalSubmitInteraction, MessageEmbed } from 'discord.js';

import logFile from '../../../globalUtils/logFile';
import { ModalSubmit } from '../../ModalSubmit';
import { updateTeam } from '../../../supabase/supabaseFunctions/teams';
import errorMessageTemplate from '../../../globalUtils/errorMessageTemplate';
import infoMessageEmbed, { types } from '../../../globalUtils/infoMessageEmbed';
import botConfig from '../../../botConfig';

const editTeamInfoModal: ModalSubmit = {
	customId: 'editTeamInfoModal',
	run: async (client: Client, interaction: ModalSubmitInteraction) => {
		try {
			await interaction.deferUpdate();

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
				| any = interaction.message?.embeds[0].fields?.find((r) =>
				r.name.includes('Registered players'),
			);

			const eventDateTime:
				| {
						name: string;
						value: string;
						inline: boolean;
				  }
				| any = interaction.message?.embeds[0].fields?.find(
				(r) => r.name === 'Event Date and Time',
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

			const teamLeader:
				| {
						name: string;
						value: string;
						inline: boolean;
				  }
				| any = interaction.message?.embeds[0].fields?.find(
				(r) => r.name === 'Team Leader',
			);

			const teamName: string =
				interaction.fields.getTextInputValue('teamName');
			const teamShortDescription: string =
				interaction.fields.getTextInputValue('teamShortDescription');

			const editedEmbed = new MessageEmbed()
				.setColor(botConfig.color.default)
				.setTitle(teamName)
				.setDescription(`>>> ${teamShortDescription}`)
				.addFields([
					{
						name: 'Team Leader',
						value: teamLeader.value,
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

			await interaction.editReply({
				embeds: [editedEmbed],
			});

			return await interaction.followUp({
				embeds: [
					infoMessageEmbed({
						title: ':white_check_mark: Team info updated successfully!',
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
				file: 'teamEvent/editTeamInfoModal',
			});
		}
	},
};

export default editTeamInfoModal;
