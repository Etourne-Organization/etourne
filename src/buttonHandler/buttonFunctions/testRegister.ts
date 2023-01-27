import fs from 'fs';

import { Client, ButtonInteraction } from 'discord.js';

import { ButtonFunction } from '../ButtonStructure';

const testRegister: ButtonFunction = {
	customId: 'testregister',
	run: async (client: Client, interaction: ButtonInteraction) => {
		interaction.reply({
			content: 'hello',
		});
	},
};

export default testRegister;
