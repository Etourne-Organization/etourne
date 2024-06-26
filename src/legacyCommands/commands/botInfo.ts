import { Message, Client, MessageEmbed } from 'discord.js';
import botConfig from '../../botConfig';

const PREFIX: any = process.env.PREFIX;

const botInfo = (message: Message, CMD_NAME: string, client: Client) => {
	const { user, guilds } = client;

	const botInfoEmbed = new MessageEmbed()
		.setColor(botConfig.color.default)
		.setThumbnail(user!.displayAvatarURL())
		.setAuthor({
			name: `${user!.username}`,
			iconURL: `${user!.displayAvatarURL()}`,
		})
		.addFields(
			// { name: '\u200B', value: '\u200B' },
			{ name: 'Bot Tag', value: `${user!.tag}` },
			{ name: 'Bot version', value: `1.0.0-beta` },
			{ name: 'Bot command prefix', value: `${PREFIX}` },

			{
				name: 'Server Count',
				value: `${guilds.cache.size}`,
			},
			{
				name: 'Currently being hosted on',
				value: `https://creavite.co/`,
			},
			{
				name: 'Status of the app/bot',
				value: `Work in progress`,
			},
			{
				name: 'Time since last restart',
				value: `${process.uptime().toFixed(2)}s`,
			},
		)
		.setFooter({ text: 'Creator: mz10ah#0054' })
		.setTimestamp();

	if (CMD_NAME === 'botinfo') {
		message.channel.send({ embeds: [botInfoEmbed] });
	}
};

export default botInfo;
