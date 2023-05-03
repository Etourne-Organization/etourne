"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const infoMessageEmbed_1 = tslib_1.__importDefault(require("../../../globalUtils/infoMessageEmbed"));
const users_1 = require("../../../supabase/supabaseFunctions/users");
const setUserRole = {
    name: 'setuserrole',
    description: 'Set user role',
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'Select user',
            type: 'USER',
            required: true,
        },
        {
            name: 'role',
            description: 'Select role to assign',
            type: 'STRING',
            required: true,
            choices: [
                {
                    name: 'Player',
                    value: '1',
                },
                {
                    name: 'Manager',
                    value: '2',
                },
                {
                    name: 'Admin',
                    value: '3',
                },
            ],
        },
    ],
    run: async (client, interaction) => {
        try {
            const user = interaction.options.getUser('user');
            const role = interaction.options.get('role');
            const userRoleDB = await (0, users_1.getUserRole)({
                discordUserId: interaction.user.id,
                discordServerId: interaction.guild.id,
            });
            if (interaction.user.id !== '374230181889572876') {
                if (userRoleDB.length === 0 || userRoleDB[0]['roleId'] !== 3) {
                    return await interaction.reply({
                        embeds: [
                            (0, infoMessageEmbed_1.default)(':warning: You are not allowed to run this command!', 'WARNING'),
                        ],
                        ephemeral: true,
                    });
                }
            }
            await (0, users_1.setUserRole)({
                discordServerId: interaction.guild.id,
                discordUserId: user.id,
                roleId: parseInt(role.value),
                username: user.tag,
            });
            await interaction.reply({
                embeds: [
                    (0, infoMessageEmbed_1.default)(`:white_check_mark: ${user.tag}'s role has been set!`),
                ],
                ephemeral: true,
            });
        }
        catch (err) {
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in slashcommands/setUserRole/setUserRole.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = setUserRole;
