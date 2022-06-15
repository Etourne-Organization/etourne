const PREFIX = process.env.PREFIX;

const legacyCommands = require('./commandsList');
const infoMessageEmbed = require('../globalUtils/infoMessageEmbed');

const commands = (message, client) => {
	if (!message.author.bot && message.content.startsWith(PREFIX)) {
		const [CMD_NAME, ...args] = message.content
			.trim()
			.substring(PREFIX.length)
			.split(/\s+/); //this is a regular expression which eliminates multiple whitespaces in the command

		if (CMD_NAME in legacyCommands) {
			legacyCommands[CMD_NAME](message, CMD_NAME, args, client);
		} else {
			message.channel.send({
				embeds: [infoMessageEmbed(':x: Wrong Command :x:')],
			});
		}
	}
};

module.exports = commands;
