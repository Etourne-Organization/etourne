import {
	Client,
	Interaction,
	MessageEmbed,
	Message,
	MessageButton,
	MessageActionRow,
} from 'discord.js';
import fs from 'fs';

import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';

export default (
	client: Client,
	teamModalId: string,
	eventName: string,
	eventDateTime: string | number,
	createTeamBtnId: string,
): void => {
	let teamName: string | any;
	let teamShortDescription: string | any;
	let message: Message | any;

	let registeredPlayerNamesList: string[] = [];
	let registeredPlayerNames: string = '>>>  ';

	client.on('interactionCreate', async (i: Interaction) => {
		try {
			const registerBtnId: string = `registerBtn-${i.id}`;
			const unregisterBtnId: string = `unregisterBtn-${i.id}`;

			console.log(i.isButton());

			if (i.isModalSubmit() && i.customId === teamModalId) {
				teamName = i.fields.getTextInputValue('teamName');
				teamShortDescription = i.fields.getTextInputValue(
					'teamShortDescription',
				);

				const buttons = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId(registerBtnId)
						.setLabel('Register')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId(unregisterBtnId)
						.setLabel('Unregister')
						.setStyle('DANGER'),
				);

				const teamEmbed = new MessageEmbed()
					.setColor('#3a9ce2')
					.setTitle(teamName)
					.setDescription(`>>> ${teamShortDescription}`)
					.addField('Team Leader', `${i.user.tag}`)
					.addField('Event Name', `${eventName}`)
					.addField('Event Date and Time', `<t:${eventDateTime}:F>`);

				message = await i.channel?.send({
					embeds: [teamEmbed],
					components: [buttons],
				});

				i.reply({
					embeds: [infoMessageEmbed('Team created')],
					ephemeral: true,
				});
			}
			// else if (i.isButton()) {
			// 	console.log('im here');
			// 	console.log(i.customId);
			// 	console.log('createTeamBtnId', createTeamBtnId);

			// 	if (i.customId.includes('register')) {
			// 		console.log(`register: ${i.customId}`);
			// 		i.reply({ content: `register: ${createTeamBtnId}` });
			// 	}

			// 	if (i.customId.includes('unregister')) {
			// 		console.log(`unregister: ${i.customId}`);
			// 		i.reply({ content: `unregister: ${createTeamBtnId}` });
			// 	}
			// }
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in slashcommands/createTeamEvent/createTeamInteractionCreate.ts \n Actual error: ${err} \n \n`,
					(err) => {
						if (err) throw err;
					},
				);
			} catch (err) {
				console.log('Error logging failed');
			}
		}
	});
};
