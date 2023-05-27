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
import { removePlayer as removeSupabasePlayer } from '../../../supabase/supabaseFunctions/singlePlayers';
import { getColumnValueById } from '../../../supabase/supabaseFunctions/events';

const removePlayer: SelectMenu = {
	customId: 'removePlayer',
	run: async (client: Client, interaction: SelectMenuInteraction) => {
		try {
			const username: string = interaction.values[0].split('||')[0];
			const userId: string = interaction.values[0].split('||')[1];
			const eventId: string | any =
				interaction.message.embeds[0].footer?.text.split(': ')[1];

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
					infoMessageEmbed(`Are you sure you want to remove ${username}?`),
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

					const messageId: any = await getColumnValueById({
						columnName: 'messageId',
						id: parseInt(eventId),
					});

					const fetchedMessage = await interaction.channel?.messages.fetch(
						messageId[0]['messageId'],
					);

					if (fetchedMessage) {
						const footer = fetchedMessage.embeds[0].footer?.text;

						let FOUND: boolean = false;
						const registeredPlayers: any =
							fetchedMessage.embeds[0].fields?.find((r) =>
								r.name.includes('Registered players'),
							);

						const oldPlayersList: [string] = registeredPlayers.value
							.split('>>> ')[1]
							.split('\n');

						const index = oldPlayersList.indexOf(username);
						oldPlayersList.splice(index, 1);
						const newPlayersList: string = oldPlayersList.join('\n');

						/* assigning updated player list back to the orignal embed field AND update player count */
						fetchedMessage.embeds[0].fields?.find((r) => {
							if (r.name.includes('Registered players')) {
								let numRegisteredPlayers: number = parseInt(
									r.name.split(' ')[2].split('/')[0],
								);
								const maxNumPlayersEmbedValue = r.name
									.split(' ')[2]
									.split('/')[1];

								numRegisteredPlayers -= 1;

								r.name = `Registered players ${numRegisteredPlayers}/${maxNumPlayersEmbedValue}`;
								r.value = `${
									newPlayersList.length > 0 ? '>>>' : ' '
								} ${newPlayersList}`;
							}
						});

						await removeSupabasePlayer({
							discordUserId: userId,
							eventId: eventId,
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

						await fetchedMessage.edit({
							embeds: [editedEmbed],
						});
					}

					await i.reply({
						embeds: [
							infoMessageEmbed(
								`:white_check_mark: Removed ${username} successfully!`,
								'SUCCESS',
							),
						],
						ephemeral: true,
					});
				} else if (i.customId === 'deleteNo') {
					await interaction.deleteReply();

					await i.reply({
						embeds: [
							infoMessageEmbed(`:x: Player ${username} was not deleted`),
						],
						ephemeral: true,
					});
				}
			});
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in selectMenuFunctions/removePlayer/removePlayer.ts \n Actual error: ${err} \n \n`,
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

export default removePlayer;
