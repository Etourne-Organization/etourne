// ** this might be useful in the future **

import { BaseCommandInteraction } from 'discord.js';

const getMessageFromGuild = async (
	interaction: BaseCommandInteraction,
	messageId: string,
) => {
	console.log(messageId);
	let target: any;

	const channels: any = interaction.guild!.channels.cache.filter(
		(c) => c.type == 'GUILD_TEXT',
	);

	for (const channel of channels) {
		target = await channel[1]
			.messages!.fetch(messageId)
			.catch((err: any) => {});

		if (target) return target;
	}

	console.log('target', target);
	return target;
};

export default getMessageFromGuild;
