import { MessageEmbed } from 'discord.js';
import botConfig from '../botConfig';

export enum types {
	INFO,
	ERROR,
	SUCCESS,
	WARNING,
}

interface infoMessageEmbed {
	title: string;
	description?: string;
	fields?: { name: string; value: string; inline?: boolean }[];
	type?: types;
}

const infoMessageEmbed = (props: infoMessageEmbed) => {
	const { title, description, fields, type } = props;

	const embed = new MessageEmbed().setTitle(title).setTimestamp();

	if (description) {
		embed.setDescription(description);
	}

	if (fields && fields?.length > 0) {
		embed.addFields(fields);
	}

	switch (type) {
		case types.ERROR:
			embed.setColor(botConfig.color.red);
			break;
		case types.WARNING:
			embed.setColor(botConfig.color.red);
			break;
		case types.SUCCESS:
			embed.setColor(botConfig.color.green);
			break;
		case types.INFO:
			embed.setColor(botConfig.color.orange);
			break;
		default:
			embed.setColor(botConfig.color.default);
			break;
	}

	return embed;
};

export default infoMessageEmbed;
