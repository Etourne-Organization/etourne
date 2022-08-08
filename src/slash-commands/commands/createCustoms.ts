import {
	BaseCommandInteraction,
	Client,
	Constants,
	MessageEmbed,
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

			// const eventName: string | any = options.get('eventname')?.value;

			// console.log(eventName);

			interaction.reply({ content: 'event' });
		} catch (err) {
			console.log({
				actualError: err,
				message: 'Something went wrong in createCustoms.ts',
			});
		}
	},
};

export default createCustoms;
