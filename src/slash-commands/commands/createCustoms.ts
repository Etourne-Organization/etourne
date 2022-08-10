import {
	BaseCommandInteraction,
	Client,
	Constants,
	MessageEmbed,
	MessageAttachment,
	MessageActionRow,
	MessageButton,
} from 'discord.js';

import { Command } from '../CommandStructure';
import botConfig from '../../botConfig/botConfig.json';

const createCustoms: Command = {
	name: 'createcustoms',
	description: 'Create customs event',
	type: 'CHAT_INPUT',
	options: [
		{
			name: 'eventname',
			description: 'Name of the event',
			required: true,
			type: Constants.ApplicationCommandOptionTypes.STRING,
		},

		{
			name: 'gamename',
			description: 'Name of the game that is going to be played',
			required: true,
			type: Constants.ApplicationCommandOptionTypes.STRING,
		},
		{
			name: 'description',
			description: 'Description of the event',
			required: true,
			type: Constants.ApplicationCommandOptionTypes.STRING,
		},
	],
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			const { options } = interaction;

			const eventName: string | any = options.get('eventname')?.value;
			const gameName: string | any = options.get('gamename')?.value;
			const description: string | any = options.get('description')?.value;

			const playerNames: String[] = ['Adam', 'Farhaan', 'mz10ah', 'Rehan'];

			let registeredPlayerNames: string = '>>>';

			playerNames.forEach((player) => {
				registeredPlayerNames = registeredPlayerNames + player + '\n';
			});

			/* *** have a look into adding game logo as thumbnails from local machine afterwards *** */
			const attachment = new MessageAttachment(
				'../../gameImages/fall-guys-image.jpg',
				'fall-guys',
			);

			const eventEmbed = new MessageEmbed()
				.setColor('#3a9ce2')
				.setTitle(eventName)
				// .setAuthor({
				// 	name: interaction.user.tag,
				// 	iconURL: interaction.user.displayAvatarURL(),
				// })
				.setDescription(`Hosted by: ${interaction.user.tag}`)
				.addField('Event date', '24/03/2022', true)
				.addField('Game name', gameName, true)
				.addField('Event description', description)
				.addField('Registered players', `${registeredPlayerNames}`);

			interaction.reply({ embeds: [eventEmbed] });
		} catch (err) {
			console.log({
				actualError: err,
				message: 'Something went wrong in createCustoms.ts',
			});
		}
	},
};

export default createCustoms;
