"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hello = {
    name: 'hello',
    description: 'Returns a greeting',
    type: 'CHAT_INPUT',
    run: async (client, interaction) => {
        const content = 'Hello there';
        await interaction.reply({
            content: content,
            ephemeral: false,
        });
    },
};
exports.default = hello;
