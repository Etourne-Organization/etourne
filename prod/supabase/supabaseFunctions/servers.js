"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerId = exports.checkAddServer = exports.addServer = exports.checkServerExists = void 0;
const supabase_1 = require("../supabase");
const checkServerExists = async (props) => {
    const { discordServerId } = props;
    const { data, error } = await supabase_1.supabase
        .from('DiscordServers')
        .select('id')
        .eq('serverId', discordServerId);
    if (data.length > 0) {
        return true;
    }
    else {
        return false;
    }
};
exports.checkServerExists = checkServerExists;
const addServer = async (props) => {
    const { discordServerId, name } = props;
    const { data, error } = await supabase_1.supabase
        .from('DiscordServers')
        .insert([{ serverId: discordServerId, name: name }])
        .select();
    return { data, error };
};
exports.addServer = addServer;
const checkAddServer = async (props) => {
    const { discordServerId, name } = props;
    if (!(await (0, exports.checkServerExists)({ discordServerId: discordServerId }))) {
        const { data: addServerData, error: addServerError } = await (0, exports.addServer)({
            discordServerId: discordServerId,
            name: name,
        });
    }
};
exports.checkAddServer = checkAddServer;
const getServerId = async (props) => {
    const { discordServerId } = props;
    const { data, error } = await supabase_1.supabase
        .from('DiscordServers')
        .select('id')
        .eq('serverId', discordServerId);
    return { data, error };
};
exports.getServerId = getServerId;
