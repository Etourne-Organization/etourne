import { Client, ModalSubmitInteraction } from 'discord.js';

export interface ModalSubmit {
	customId: string;
	run: (client: Client, interaction: ModalSubmitInteraction) => Promise<unknown>;
}
