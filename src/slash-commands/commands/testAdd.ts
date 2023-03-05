import fs from 'fs';

import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';

import { Command } from '../CommandStructure';
import { supabase } from '../../supabase/supabase';

const testAdd: Command = {
	name: 'testadd',
	description: 'Test add',
	type: 'CHAT_INPUT',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			// const { data: d, error: e } = await supabase.auth.signInWithOAuth({
			// 	provider: 'discord',
			// });

			const { data, error } = await supabase
				.from('Users')
				.insert([{ username: 'someValue', role: 'otherValue' }]);

			// console.log('auth data', d);
			// console.log('auth error', e);
			console.log('addUser data', data);
			console.log('addUser error', error);

			await interaction.reply({
				content: 'Done',
			});
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in slashcommands/testAdd.ts \n Actual error: ${err} \n \n`,
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

export default testAdd;
