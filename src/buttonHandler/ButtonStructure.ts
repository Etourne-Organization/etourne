import { Client, ButtonInteraction } from 'discord.js';

export interface ButtonFunction {
	customId: string;
	run: (Client: Client, interaction: ButtonInteraction) => void;
}
