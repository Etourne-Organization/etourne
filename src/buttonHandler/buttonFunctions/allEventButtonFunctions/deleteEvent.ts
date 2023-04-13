import fs from 'fs';

import {
	Client,
	ButtonInteraction,
	MessageEmbed,
	MessageButton,
	MessageActionRow,
} from 'discord.js';

import { ButtonFunction } from '../../ButtonStructure';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';

import { deleteEvent as deleteEventSupabase } from '../../../supabase/supabaseFunctions/events';

const deleteEvent: ButtonFunction = {
	customId: 'deleteEvent',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			const eventHostUsername: any =
				interaction.message.embeds[0].fields?.find(
					(r) => r.name === 'Hosted by',
				)?.value;

			if (eventHostUsername !== interaction.user.tag) {
				return interaction.reply({
					embeds: [
						infoMessageEmbed(
							'You are not allowed to use this button!',
							'WARNING',
						),
					],
					ephemeral: true,
				});
			}

			const eventId: string | any =
				interaction.message.embeds[0].footer?.text.split(': ')[1];

			const fetchedMessage = await interaction.channel?.messages.fetch(
				interaction.message.id,
			);

			if (fetchedMessage) {
				const confirmationButtons = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId('deleteYes')
						.setLabel('✔')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('deleteNo')
						.setLabel('✖')
						.setStyle('SECONDARY'),
				);

				await interaction.reply({
					embeds: [
						infoMessageEmbed(
							'Are you sure you want to delete the event?',
						),
					],
					components: [confirmationButtons],
					ephemeral: true,
				});

				const filter: any = (i: ButtonInteraction) =>
					(i.customId === 'deleteYes' || i.customId === 'deleteNo') &&
					i.user.id === interaction.user.id;

				const collector =
					interaction.channel?.createMessageComponentCollector({
						filter,
						time: 15000,
						max: 1,
						maxComponents: 1,
					});

				collector?.on('collect', async (i: ButtonInteraction) => {
					if (i.customId === 'deleteYes') {
						await fetchedMessage.delete();

						await interaction.deleteReply();

						deleteEventSupabase({ eventId: parseInt(eventId) });

						await i.reply({
							embeds: [
								infoMessageEmbed(
									':white_check_mark: Event deleted successfully!',
									'SUCCESS',
								),
							],
							ephemeral: true,
						});
					} else if (i.customId === 'deleteNo') {
						await interaction.deleteReply();

						await i.reply({
							embeds: [infoMessageEmbed(':x: Event not deleted')],
							ephemeral: true,
						});
					}
				});
			} else {
				await interaction.reply({
					embeds: [infoMessageEmbed('Something went wrong', 'WARNING')],
					ephemeral: true,
				});
			}
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in buttonFunctions/allEventButtonFunctions/deleteEvent.ts \n Actual error: ${err} \n \n`,
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

export default deleteEvent;