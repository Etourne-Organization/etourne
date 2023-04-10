import fs from 'fs';

import {
	Client,
	ModalSubmitInteraction,
	MessageEmbed,
	MessageButton,
	MessageActionRow,
} from 'discord.js';

import { ModalFunction } from '../../ModalSubmitStructure';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';
import { addTeam } from '../../../supabase/supabaseFunctions/teams';

const teamModal: ModalFunction = {
	customId: 'teamModalSubmit',
	run: async (client: Client, interaction: ModalSubmitInteraction) => {
		try {
			const eventId: string | any =
				interaction.message?.embeds[0].footer?.text.split(': ')[1];

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
					.setCustomId('registerTeamMember')
					.setLabel('Register')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('unregisterTeamMember')
					.setLabel('Unregister')
					.setStyle('DANGER'),
				new MessageButton()
					.setCustomId('deleteTeam')
					.setLabel('🗑️  Delete team')
					.setStyle('DANGER'),
			);

			const teamEmbed = new MessageEmbed()
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
						value: eventName,
					},
					{
						name: 'Event Date and Time',
						value: eventDateTime,
					},
					{
						name: 'Registered players',
						value: ` `,
					},
				]);

			const teamID = await addTeam({
				eventId: eventId,
				teamName: teamName,
				teamDescription: teamShortDescription,
			});

			teamEmbed.setFooter({
				text: `Event ID: ${eventId} Team ID: ${teamID}`,
			});

			await interaction.channel?.send({
				embeds: [teamEmbed],
				components: [buttons],
			});

			await interaction.reply({
				embeds: [
					infoMessageEmbed(
						':white_check_mark: Team created successfully',
						'SUCCESS',
					),
				],
				ephemeral: true,
			});
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in modalFunctions/teamEvent/teamModal.ts \n Actual error: ${err} \n \n`,
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

export default teamModal;
