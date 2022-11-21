"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const PREFIX = process.env.PREFIX;
const botInfo = (message, CMD_NAME, args, client) => {
    const { user, guilds } = client;
    const botInfoEmbed = new discord_js_1.MessageEmbed()
        .setColor('#3A9CE2')
        .setThumbnail(user.displayAvatarURL())
        .setAuthor({
        name: `${user.username}`,
        iconURL: `${user.displayAvatarURL()}`,
    })
        .addFields({ name: 'Bot Tag', value: `${user.tag}` }, { name: 'Bot version', value: `1.0.0-beta` }, { name: 'Bot command prefix', value: `${PREFIX}` }, {
        name: 'Server Count',
        value: `${guilds.cache.size}`,
    }, {
        name: 'Currently being hosted on',
        value: `https://creavite.co/`,
    }, {
        name: 'Status of the app/bot',
        value: `Work in progress`,
    }, {
        name: 'Time since last restart',
        value: `${process.uptime().toFixed(2)}s`,
    })
        .setFooter({ text: 'Creator: mz10ah#0054' })
        .setTimestamp();
    if (CMD_NAME === 'botinfo') {
        message.channel.send({ embeds: [botInfoEmbed] });
    }
};
exports.default = botInfo;
