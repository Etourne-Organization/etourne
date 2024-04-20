import {
	Client,
	ButtonInteraction,
	MessageButton,
	MessageActionRow,
} from 'discord.js';

import logFile from '../../../globalUtils/logFile';
import { ButtonFunction } from '../../Button';
import infoMessageEmbed, { types } from '../../../globalUtils/infoMessageEmbed';
import { getUserRole } from '../../../supabase/supabaseFunctions/users';
import { deleteEvent as deleteEventSupabase } from '../../../supabase/supabaseFunctions/events';
import errorMessageTemplate from '../../../globalUtils/errorMessageTemplate';

const deleteEvent: ButtonFunction = {
	customId: 'deleteEvent',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			await interaction.reply({
				content: ':hourglass_flowing_sand:  Processing...',
				ephemeral: true,
			});

			// check user role in DB
			const userRoleDB: any = await getUserRole({
				discordUserId: interaction.user.id,
				discordServerId: interaction.guild!.id,
			});

			if (
				userRoleDB.length === 0 ||
				(userRoleDB[0]['roleId'] !== 3 && userRoleDB[0]['roleId'] !== 2)
			) {
				return await interaction.editReply({
					content: ' ',
					embeds: [
						infoMessageEmbed({
							title: ':warning: You are not allowed to use this button!',
							type: types.ERROR,
						}),
					],
				});
			}

			// const eventHostUsername: any =
			// 	interaction.message.embeds[0].fields?.find(
			// 		(r) => r.name === 'Hosted by',
			// 	)?.value;

			// if (
			// 	userRoleDB[0]['roleId'] !== 3 &&
			// 	eventHostUsername !== interaction.user.tag
			// ) {
			// 	return interaction.reply({
			// 		embeds: [
			// 			infoMessageEmbed(
			// 				':warning: You are not allowed to use this button!',
			// 				'WARNING',
			// 			),
			// 		],
			// 		ephemeral: true,
			// 	});
			// }

			const eventId: string | any =
				interaction.message.embeds[0].footer?.text.split(': ')[1];

			const fetchedMessage = await interaction.channel?.messages.fetch(
				interaction.message.id,
			);

			if (fetchedMessage) {
				const confirmationButtons = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId(`deleteYes-${interaction.id}`)
						.setLabel('✔')
						.setStyle('SUCCESS'),
					new MessageButton()
						.setCustomId(`deleteNo-${interaction.id}`)
						.setLabel('✖')
						.setStyle('DANGER'),
				);

				await interaction.editReply({
					content: ' ',
					embeds: [
						infoMessageEmbed({
							title: ':question: Are you sure you want to delete the event?',
						}),
					],
					components: [confirmationButtons],
				});

				const filter: any = (i: ButtonInteraction) =>
					(i.customId === `deleteYes-${interaction.id}` ||
						i.customId === `deleteNo-${interaction.id}`) &&
					i.user.id === interaction.user.id;

				const collector =
					interaction.channel?.createMessageComponentCollector({
						filter,
						time: 15000,
						// max: 1,
						// maxComponents: 1,
					});

				collector?.on('collect', async (i: ButtonInteraction) => {
					if (i.customId.includes('deleteYes')) {
						await fetchedMessage.delete();
						await i.reply({
							content: ':hourglass_flowing_sand:  Processing...',
							ephemeral: true,
						});

						await deleteEventSupabase({ eventId: parseInt(eventId) });

						await interaction.deleteReply();

						await i.editReply({
							embeds: [
								infoMessageEmbed({
									title: ':white_check_mark: Event deleted successfully!',
									type: types.SUCCESS,
								}),
							],
							content: ' ',
						});
					} else if (i.customId.includes('deleteNo')) {
						await interaction.deleteReply();

						await i.reply({
							embeds: [
								infoMessageEmbed({
									title: ':x: Event not deleted',
								}),
							],
							ephemeral: true,
						});
					}
				});
			} else {
				await interaction.editReply({
					content: ' ',
					embeds: [
						infoMessageEmbed({
							title: ':x: Something went wrong',
							type: types.ERROR,
						}),
					],
				});
			}
		} catch (err) {
			await interaction.editReply({
				embeds: [
					infoMessageEmbed({
						title: errorMessageTemplate().title,
						description: errorMessageTemplate().description,
						type: types.ERROR,
					}),
				],
				content: ' ',
			});

			logFile({
				error: err,
				folder: 'buttonHandler/functions',
				file: 'allEventfunctions/deleteEvent',
			});
		}
	},
};

export default deleteEvent;
