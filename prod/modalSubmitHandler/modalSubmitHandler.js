"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const modalSubmitFunctionList_1 = tslib_1.__importDefault(require("./modalSubmitFunctionList"));
exports.default = async (client, interaction) => {
    try {
        const { customId } = interaction;
        const modalSubmitFunction = modalSubmitFunctionList_1.default.find((m) => {
            const temp = customId.split('-');
            if (temp.indexOf(m.customId) !== -1) {
                return m;
            }
        });
        if (!modalSubmitFunction) {
            return;
        }
        modalSubmitFunction.run(client, interaction);
    }
    catch (err) {
        try {
            fs_1.default.appendFile('logs/crash_logs.txt', `${new Date()} : Something went wrong in modalFormHandler.ts \n Actual error: ${err} \n \n`, (err) => {
                if (err)
                    throw err;
            });
        }
        catch (err) {
            console.log('Error logging failed');
        }
    }
};
