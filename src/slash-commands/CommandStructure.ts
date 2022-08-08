import {
	BaseCommandInteraction,
	ChatInputApplicationCommandData,
	Client,
} from 'discord.js';

export interface Command extends ChatInputApplicationCommandData {
	run: (Client: Client, interaction: BaseCommandInteraction) => void;
}
