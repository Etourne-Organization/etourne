"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const buttonList_1 = tslib_1.__importDefault(require("./buttonList"));
exports.default = async (client, interaction) => {
    try {
        const { customId } = interaction;
        const buttonFunction = buttonList_1.default.find((b) => b.customId === customId);
        if (!buttonFunction) {
            return;
        }
        buttonFunction.run(client, interaction);
    }
    catch (err) {
        try {
            fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in buttonHandler.ts \n Actual error: ${err} \n \n`, (err) => {
                if (err)
                    throw err;
            });
        }
        catch (err) {
            console.log('Error logging failed');
        }
    }
};
