"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const botInfo = {
    name: 'botinfo',
    description: 'Information about the bot',
    type: 'CHAT_INPUT',
    run: async (client, interaction) => {
        try {
            const botInfoEmbed = new discord_js_1.MessageEmbed()
                .setColor('#3A9CE2')
                .setThumbnail(client.user.displayAvatarURL())
                .setAuthor({
                name: `${client.user.username}`,
                iconURL: `${client.user.displayAvatarURL()}`,
            })
                .addFields({ name: 'Bot Tag', value: `${client.user.tag}` }, { name: 'Bot version', value: `1.0.0-beta` }, {
                name: 'Bot command prefix',
                value: `\`${process.env.PREFIX}\``,
            }, {
                name: 'Server Count',
                value: `${client.guilds.cache.size}`,
            }, {
                name: 'Status of the app/bot',
                value: `Work in progress`,
            }, {
                name: 'Time since last restart',
                value: `${process.uptime().toFixed(2)}s`,
            })
                .setFooter({ text: 'Creator: mz10ah#0054' })
                .setTimestamp();
            await interaction.reply({
                embeds: [botInfoEmbed],
            });
        }
        catch (err) {
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in slashcommands/botInfo.ts \n Actual error: ${err} \n \n`, (err) => {
                    if (err)
                        throw err;
                });
            }
            catch (err) {
                console.log('Error logging failed');
            }
        }
    },
};
exports.default = botInfo;