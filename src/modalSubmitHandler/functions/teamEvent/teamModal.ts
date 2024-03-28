import {
	Client,
	ModalSubmitInteraction,
	MessageEmbed,
	MessageButton,
	MessageActionRow,
} from 'discord.js';

import logFile from '../../../globalUtils/logFile';
import { ModalSubmit } from '../../ModalSubmit';
import infoMessageEmbed, { types } from '../../../globalUtils/infoMessageEmbed';
import {
	addTeam,
	setColumnValue,
} from '../../../supabase/supabaseFunctions/teams';
import { getColumnValueById } from '../../../supabase/supabaseFunctions/events';
import errorMessageTemplate from '../../../globalUtils/errorMessageTemplate';
import botConfig from '../../../botConfig';

const teamModal: ModalSubmit = {
	customId: 'teamModalSubmit',
	run: async (client: Client, interaction: ModalSubmitInteraction) => {
		try {
			const eventId: string | any =
				interaction.message?.embeds[0].footer?.text.split(': ')[1];

			const maxNumTeamPlayers: any = await getColumnValueById({
				id: eventId,
				columnName: 'maxNumTeamPlayers',
			});

			const eventName: any = interaction.message?.embeds[0].title;
			const eventDateTime: any = interaction.message?.embeds[0].fields?.find(
				(r) => r.name === 'Event date & time',
			)?.value;

			const teamName: string =
				interaction.fields.getTextInputValue('teamName');
			const teamShortDescription: string =
				interaction.fields.getTextInputValue('teamShortDescription');

			const buttons = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId('registerTeamPlayer')
					.setLabel('Register')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('unregisterTeamPlayer')
					.setLabel('Unregister')
					.setStyle('DANGER'),
			);

			const manageTeamPlayersButtons = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId('removeTeamPlayer')
					.setLabel('❌  Remove team player')
					.setStyle('SECONDARY'),
			);

			const manageTeamButtons = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId('editTeamInfo')
					.setLabel('⚙️  Edit team info')
					.setStyle('SECONDARY'),
				new MessageButton()
					.setCustomId('deleteTeam')
					.setLabel('🗑️  Delete team')
					.setStyle('DANGER'),
			);

			const teamEmbed = new MessageEmbed()
				.setColor(botConfig.color.default)
				.setTitle(teamName)
				.setDescription(`>>> ${teamShortDescription}`)
				.addFields([
					{
						name: 'Team Leader',
						value: interaction.user.tag,
					},
					{
						name: 'Event Name',
						value: eventName,
					},
					{
						name: 'Event Date and Time',
						value: eventDateTime,
					},
					{
						name: `Registered players 0/${
							maxNumTeamPlayers.length > 0
								? maxNumTeamPlayers[0]['maxNumTeamPlayers']
								: 'unlimited'
						}`,
						value: ` `,
					},
				]);

			const teamId = await addTeam({
				eventId: eventId,
				teamName: teamName,
				teamDescription: teamShortDescription,
				teamLeaderDiscordUserId: interaction.user.id,
				teamLeaderUsername: interaction.user.tag,
				discordServerId: interaction.guild!.id,
			});

			teamEmbed.setFooter({
				text: `Team ID: ${teamId} Event ID: ${eventId}`,
			});

			const reply = await interaction.channel?.send({
				embeds: [teamEmbed],
				components: [buttons, manageTeamPlayersButtons, manageTeamButtons],
			});

			await setColumnValue({
				data: [
					{
						id: teamId,
						key: 'messageId',
						value: reply!.id,
					},
				],
			});

			await interaction.reply({
				embeds: [
					infoMessageEmbed({
						title: ':white_check_mark: Team created successfully',
						type: types.SUCCESS,
					}),
				],
				ephemeral: true,
			});
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

			logFile({
				error: err,
				folder: 'modalSubmitHandler/functions',
				file: 'teamEvent/teamModal',
			});
		}
	},
};

export default teamModal;
