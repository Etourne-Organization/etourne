"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const commandIDs_json_1 = tslib_1.__importDefault(require("../../TEST_COMMAND_IDS/commandIDs.json"));
const commandIDs_json_2 = tslib_1.__importDefault(require("../../ORIGINAL_COMMAND_IDS/commandIDs.json"));
const getStarted = {
    name: 'getstarted',
    description: 'Helps any user to get started with Etourne',
    run: async (client, interaction) => {
        try {
            const embed = new discord_js_1.MessageEmbed()
                .setColor('#3a9ce2')
                .setThumbnail(`${client.user?.displayAvatarURL()}`)
                .setTitle(':rocket: Get started')
                .setDescription(`Thank you for choosing Etourne. \n \n In summary, Etourne aims to create and manage events and tournaments much easier. \n \n To get started: \n • Use ${process.env.BOT_IDS === 'TEST_BOT_IDS'
                ? `</createevent:${commandIDs_json_1.default.CREATE_EVENT}>`
                : `</createvent:${commandIDs_json_2.default.CREATE_EVENT}>`} to start creating events. \n • Use ${process.env.BOT_IDS === 'TEST_BOT_IDS'
                ? `</createteamevent:${commandIDs_json_1.default.CREATE_TEAM_EVENT}>`
                : `</createteamevent:${commandIDs_json_2.default.CREATE_TEAM_EVENT}>`} to start creating team events. \n • Use ${process.env.BOT_IDS === 'TEST_BOT_IDS'
                ? `</help:${commandIDs_json_1.default.HELP}>`
                : `</help:${commandIDs_json_2.default.HELP}>`} to find out other commands you can use.\n \n  As always, feel free to reach out to mz10ah#0054 if you face any issues or have any queries.`)
                .setFooter({ text: `Requested by: ${interaction.user.tag}` })
                .setTimestamp();
            await interaction.reply({
                embeds: [embed],
            });
        }
        catch (err) {
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in slashcommands/getStarted.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = getStarted;
