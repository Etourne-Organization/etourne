import { Client, SelectMenuInteraction } from 'discord.js';

export interface SelectMenu {
	customId: string;
	run: (client: Client, interaction: SelectMenuInteraction) => void;
}
