"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const infoMessageEmbed = (message, status) => {
    const infoEmbed = new discord_js_1.MessageEmbed().setTitle(message).setTimestamp();
    if (status === 'WARNING') {
        infoEmbed.setColor('#800000');
    }
    else if (status === 'SUCCESS') {
        infoEmbed.setColor('#008E00');
    }
    else if (status === 'ERROR') {
        infoEmbed.setColor('#800000');
    }
    else {
        infoEmbed.setColor('#3A9CE2');
    }
    return infoEmbed;
};
exports.default = infoMessageEmbed;
