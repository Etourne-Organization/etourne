import fs from 'fs';

import {
	Client,
	SelectMenuInteraction,
	MessageActionRow,
	MessageButton,
	ButtonInteraction,
	MessageEmbed,
} from 'discord.js';

import { SelectMenu } from '../../../selectMenuHandler/SelectMenu';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';
import { removePlayer } from '../../../supabase/supabaseFunctions/teamPlayers';
import { checkTeamExists } from '../../../supabase/supabaseFunctions/teams';
import { getColumnValueById } from '../../../supabase/supabaseFunctions/events';

const removeTeamPlayer: SelectMenu = {
	customId: 'removeTeamPlayer',
	run: async (client: Client, interaction: SelectMenuInteraction) => {
		try {
			const selected = interaction.values;
			const teamId: string | any =
				interaction.message.embeds[0].footer?.text.split(': ')[2];
			const eventId: string | any =
				interaction.message.embeds[0].footer?.text.split(' ')[5];

			console.log(teamId);

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

			await interaction.update({
				embeds: [
					infoMessageEmbed(
						`Are you sure you want to remove ${selected[0]}?`,
					),
				],
				components: [confirmationButtons],
			});

			const filter: any = (i: ButtonInteraction) =>
				(i.customId === 'deleteYes' || i.customId === 'deleteNo') &&
				i.user.id === interaction.user.id;

			const collector = interaction.channel?.createMessageComponentCollector(
				{
					filter,
					time: 15000,
					max: 1,
					maxComponents: 1,
				},
			);

			collector?.on('collect', async (i: ButtonInteraction) => {
				if (i.customId === 'deleteYes') {
					await interaction.deleteReply();

					if (await checkTeamExists({ teamId: teamId }))
						await removePlayer({
							discordUserId: parseInt(interaction.user.id),
							teamId: teamId,
						});

					const messageId = await getColumnValueById({
						columnName: 'messageId',
						id: eventId,
					});

					const fetchedMessage = await interaction.channel?.messages.fetch(
						messageId,
					);

					if (fetchedMessage) {
						const footer = fetchedMessage.embeds[0].footer?.text;

						let FOUND: boolean = false;
						const registeredPlayers: any =
							fetchedMessage.embeds[0].fields?.find(
								(r) => r.name === 'Registered players',
							);

						const tempSplit: Array<string> =
							registeredPlayers.value.split(' ');

						const playersSplitted: Array<string> =
							tempSplit.length <= 1 && tempSplit[0].length < 1
								? ['']
								: tempSplit[1].includes('\n')
								? tempSplit[1].split('\n')
								: [tempSplit[1]];

						const playerIndex = playersSplitted.indexOf(selected[0]);

						if (playerIndex !== -1) {
							playersSplitted.splice(playerIndex, 1);

							/* assigning updated player list back to the orignal embed field */
							fetchedMessage.embeds[0].fields?.find((r) => {
								if (r.name === 'Registered players') {
									r.value =
										playersSplitted.length >= 1
											? '>>> ' + playersSplitted.join('\n')
											: ' ';
								}
							});

							const editedEmbed = new MessageEmbed()
								.setColor('#3a9ce2')
								.setTitle(fetchedMessage.embeds[0].title || 'Undefined')
								.setDescription(
									fetchedMessage.embeds[0].description || 'Undefined',
								)
								.addFields(fetchedMessage.embeds[0].fields || [])
								.setFooter({ text: `${footer}` });

							FOUND = true;
							// return await interaction.update({ embeds: [editedEmbed] });
						}
					}

					await i.reply({
						embeds: [
							infoMessageEmbed(
								`:white_check_mark: Removed ${selected[0]} successfully!`,
								'SUCCESS',
							),
						],
						ephemeral: true,
					});
				} else if (i.customId === 'deleteNo') {
					await interaction.deleteReply();

					await i.reply({
						embeds: [
							infoMessageEmbed(
								`:x: Player ${selected[0]} was not deleted`,
							),
						],
						ephemeral: true,
					});
				}
			});
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in selectMenuFunctions/removeTeamPlayer/removeTeamPlayer.ts \n Actual error: ${err} \n \n`,
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

export default removeTeamPlayer;
