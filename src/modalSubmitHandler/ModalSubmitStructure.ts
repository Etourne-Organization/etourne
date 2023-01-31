import { Client, ModalSubmitInteraction } from 'discord.js';

export interface ModalFunction {
	customId: string;
	run: (client: Client, interaction: ModalSubmitInteraction) => void;
}
