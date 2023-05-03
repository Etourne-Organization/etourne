"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const supabase_1 = require("../../supabase/supabase");
const testAdd = {
    name: 'testadd',
    description: 'Test add',
    type: 'CHAT_INPUT',
    run: async (client, interaction) => {
        try {
            const { data, error } = await supabase_1.supabase
                .from('Test')
                .insert([{ username: 'someValues', role: 'otherValues' }]);
            await interaction.reply({
                content: 'Done',
            });
        }
        catch (err) {
            try {
                fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in slashcommands/testAdd.ts \n Actual error: ${err} \n \n`, (err) => {
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
exports.default = testAdd;
