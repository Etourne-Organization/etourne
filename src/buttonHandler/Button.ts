import { Client, ButtonInteraction } from 'discord.js';

export interface ButtonFunction {
	customId: string;
	run: (client: Client, interaction: ButtonInteraction) => void;
}
