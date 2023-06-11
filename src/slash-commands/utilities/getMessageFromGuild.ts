import { BaseCommandInteraction } from 'discord.js';

const getMessageFromGuild = async (
	interaction: BaseCommandInteraction,
	messageId: string,
) => {
	console.log(messageId);
	// const channels: any = interaction.guild!.channels.cache.filter(
	// 	(c) => c.type == 'GUILD_TEXT',
	// );

	// for (const channel of channels) {
	// 	const target = await channel[1]
	// 		.messages!.fetch(messageId)
	// 		.catch((err: any) => {});

	// 	if (target) return target;
	// }

	let found: any = null;

	interaction.guild!.channels.cache.forEach(async (channel) => {
		if (channel.type === 'GUILD_TEXT') {
			if (found) return;
			found = await channel.messages!.fetch(messageId).catch((err) => {});
		}
	});

	console.log(found);
	return found;
};

export default getMessageFromGuild;
