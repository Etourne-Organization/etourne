"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const commandIDs_json_1 = tslib_1.__importDefault(require("../../TEST_BOT_IDS/commandIDs.json"));
const commandIDs_json_2 = tslib_1.__importDefault(require("../../ORIGINAL_BOT_IDS/commandIDs.json"));
const help = {
    name: 'help',
    description: 'Help embed to see all the commands',
    type: 'CHAT_INPUT',
    run: async (client, interaction) => {
        try {
            const member = interaction.user.tag;
            const helpEmbed = new discord_js_1.MessageEmbed()
                .setColor('#3a9ce2')
                .setTitle(`${client.user?.username}`)
                .setDescription('Here is the list of commands you can use')
                .setThumbnail(`${client.user?.displayAvatarURL()}`)
                .addFields({
                name: ':calendar_spiral:  Create event',
                value: process.env.BOT_IDS === 'TEST_BOT_IDS'
                    ? `</createevent:${commandIDs_json_1.default.CREATE_EVENT}>`
                    : `</createvent:${commandIDs_json_2.default.CREATE_EVENT}>`,
            }, {
                name: ':information_source:  Bot Info',
                value: process.env.BOT_IDS === 'TEST_BOT_IDS'
                    ? `</botinfo:${commandIDs_json_1.default.BOT_INFO}>`
                    : `</botinfo:${commandIDs_json_2.default.BOT_INFO}>`,
            })
                .setTimestamp()
                .setFooter({ text: `Requested by: ${member}` });
            await interaction.reply({
                embeds: [helpEmbed],
            });
        }
        catch (err) {
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in slashcommands/help.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = help;
