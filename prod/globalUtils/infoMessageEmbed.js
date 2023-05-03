"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const infoMessageEmbed = (message, status) => {
    const infoEmbed = new discord_js_1.MessageEmbed().setTitle(message).setTimestamp();
    if (status === 'WARNING' || status === 'ERROR') {
        infoEmbed.setColor('#D83C3E');
    }
    else if (status === 'SUCCESS') {
        infoEmbed.setColor('#3BA55C');
    }
    else {
        infoEmbed.setColor('#3A9CE2');
    }
    return infoEmbed;
};
exports.default = infoMessageEmbed;
