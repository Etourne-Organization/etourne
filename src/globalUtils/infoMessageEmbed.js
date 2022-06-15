const { MessageEmbed } = require('discord.js');

const infoMessageEmbed = (message, status) => {
	const infoEmbed = new MessageEmbed().setTitle(message).setTimestamp();

	switch (status) {
		case 'WARNING':
			infoEmbed.setColor('#800000');
		case 'SUCCESS':
			infoEmbed.setColor('#008E00');
		case 'ERROR':
			infoEmbed.setColor('#800000');
		default:
			infoEmbed.setColor('#3A9CE2');
	}

	return infoEmbed;
};

module.exports = infoMessageEmbed;
