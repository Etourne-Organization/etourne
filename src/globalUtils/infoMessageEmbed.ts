import { MessageEmbed } from 'discord.js';

const infoMessageEmbed = (message: string, status?: string) => {
	const infoEmbed = new MessageEmbed().setTitle(message).setTimestamp();

	if (status === 'WARNING' || status === 'ERROR') {
		infoEmbed.setColor('#D83C3E');
	} else if (status === 'SUCCESS') {
		infoEmbed.setColor('#3BA55C');
	} else {
		infoEmbed.setColor('#3A9CE2');
	}

	return infoEmbed;
};

export default infoMessageEmbed;
