"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserSuperAdmin = exports.setUserRole = exports.getUserRole = exports.getMultipleUsernames = exports.getUsernameAndDiscordId = exports.getUserId = exports.checkAddUser = exports.addUser = void 0;
const supabase_1 = require("../supabase");
const servers_1 = require("./servers");
const addUser = async (props) => {
    const { username, discordUserId, discordServerId, roleId } = props;
    const { data: getServerIdData, error: getServerIdError } = await (0, servers_1.getServerId)({
        discordServerId: discordServerId,
    });
    const { data, error } = await supabase_1.supabase
        .from('Users')
        .insert([
        {
            userId: discordUserId,
            username: username,
            serverId: getServerIdData[0]['id'],
            roleId: roleId,
        },
    ])
        .select();
    return { data, error };
};
exports.addUser = addUser;
const checkAddUser = async (props) => {
    const { username, discordUserId, discordServerId, roleId } = props;
    const { data: getServerIdData, error: getServerIdError } = await (0, servers_1.getServerId)({
        discordServerId: discordServerId,
    });
    const { data: checkUserExistsData, error: checkUserExistsError } = await supabase_1.supabase
        .from('Users')
        .select('id')
        .eq('userId', discordUserId)
        .eq('serverId', getServerIdData[0]['id']);
    if (checkUserExistsData.length === 0) {
        await (0, exports.addUser)({
            username: username,
            discordUserId: discordUserId,
            discordServerId: discordServerId,
            roleId: roleId,
        });
    }
};
exports.checkAddUser = checkAddUser;
const getUserId = async (props) => {
    const { discordUserId } = props;
    const { data, error } = await supabase_1.supabase
        .from('Users')
        .select('id')
        .eq('userId', discordUserId);
    return { data, error };
};
exports.getUserId = getUserId;
const getUsernameAndDiscordId = async (props) => {
    const { userId } = props;
    const { data, error } = await supabase_1.supabase
        .from('Users')
        .select('username, userId')
        .eq('id', userId);
    return data;
};
exports.getUsernameAndDiscordId = getUsernameAndDiscordId;
const getMultipleUsernames = async (props) => {
    const { userIds } = props;
    const { data, error } = await supabase_1.supabase
        .from('Users')
        .select('username')
        .in('id', userIds);
    return data;
};
exports.getMultipleUsernames = getMultipleUsernames;
const getUserRole = async (props) => {
    const { discordUserId, discordServerId } = props;
    const { data: getServerIdData, error: getServerIdError } = await (0, servers_1.getServerId)({
        discordServerId: discordServerId,
    });
    const { data, error } = await supabase_1.supabase
        .from('Users')
        .select('roleId')
        .eq('userId', discordUserId)
        .eq('serverId', getServerIdData[0]['id']);
    return data;
};
exports.getUserRole = getUserRole;
const setUserRole = async (props) => {
    const { discordUserId, discordServerId, roleId, username } = props;
    const { data: getServerIdData, error: getServerIdError } = await (0, servers_1.getServerId)({
        discordServerId: discordServerId,
    });
    await (0, exports.checkAddUser)({
        discordServerId: discordServerId,
        discordUserId: discordUserId,
        username: username,
    });
    const { data, error } = await supabase_1.supabase
        .from('Users')
        .update([
        {
            roleId: roleId,
        },
    ])
        .eq('userId', discordUserId)
        .eq('serverId', getServerIdData[0]['id']);
    return data;
};
exports.setUserRole = setUserRole;
const isUserSuperAdmin = async (props) => {
    const { discordUserId } = props;
    const { data, error } = await supabase_1.supabase
        .from('SuperAdminUsers')
        .select('id')
        .eq('id', discordUserId);
    if (data.length > 0) {
        return true;
    }
    else {
        return false;
    }
};
exports.isUserSuperAdmin = isUserSuperAdmin;
