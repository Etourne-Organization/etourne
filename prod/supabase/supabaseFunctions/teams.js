"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamLeaderUsernameDiscordId = exports.getAllColumnValueById = exports.getNumOfTeams = exports.getColumnValueByEventId = exports.getColumnValueById = exports.setColumnValue = exports.checkTeamExists = exports.deleteTeam = exports.updateTeam = exports.addTeam = void 0;
const supabase_1 = require("../supabase");
const users_1 = require("./users");
const addTeam = async (props) => {
    const { eventId, teamName, teamDescription, teamLeaderDiscordUserId, discordServerId, teamLeaderUsername, } = props;
    await (0, users_1.checkAddUser)({
        discordUserId: teamLeaderDiscordUserId,
        discordServerId: discordServerId,
        username: teamLeaderUsername,
    });
    const { data: getUserIdData, error: getUserIdError } = await (0, users_1.getUserId)({
        discordUserId: teamLeaderDiscordUserId,
    });
    const { data, error } = await supabase_1.supabase
        .from('Teams')
        .insert([
        {
            name: teamName,
            description: teamDescription,
            eventId: eventId,
            teamLeader: getUserIdData[0]['id'],
        },
    ])
        .select();
    if (error)
        throw error;
    return data[0]['id'];
};
exports.addTeam = addTeam;
const updateTeam = async (props) => {
    const { id, teamName, teamDescription } = props;
    const { data, error } = await supabase_1.supabase
        .from('Teams')
        .update([
        {
            name: teamName,
            description: teamDescription,
        },
    ])
        .eq('id', id)
        .select();
    if (error)
        throw error;
    return data[0]['id'];
};
exports.updateTeam = updateTeam;
const deleteTeam = async (props) => {
    const { teamId } = props;
    const { data, error } = await supabase_1.supabase
        .from('Teams')
        .delete()
        .eq('id', teamId);
    return { data, error };
};
exports.deleteTeam = deleteTeam;
const checkTeamExists = async (props) => {
    const { teamId } = props;
    const { data, error } = await supabase_1.supabase
        .from('Teams')
        .select()
        .eq('id', teamId);
    if (error)
        throw error;
    if (data.length > 0) {
        return true;
    }
    else {
        return false;
    }
};
exports.checkTeamExists = checkTeamExists;
const setColumnValue = async (props) => {
    const { data } = props;
    for (const d of data) {
        const { data, error } = await supabase_1.supabase
            .from('Teams')
            .update({
            [d.key]: d.value,
        })
            .eq('id', d.id);
    }
};
exports.setColumnValue = setColumnValue;
const getColumnValueById = async (props) => {
    const { columnName, id } = props;
    const { data, error } = await supabase_1.supabase
        .from('Teams')
        .select(columnName)
        .eq('id', id);
    if (error)
        throw error;
    return data;
};
exports.getColumnValueById = getColumnValueById;
const getColumnValueByEventId = async (props) => {
    const { columnName, eventId } = props;
    const { data, error } = await supabase_1.supabase
        .from('Teams')
        .select(columnName)
        .eq('eventId', eventId);
    if (error)
        throw error;
    return data;
};
exports.getColumnValueByEventId = getColumnValueByEventId;
const getNumOfTeams = async (props) => {
    const { eventId } = props;
    const { data, error } = await supabase_1.supabase
        .from('Teams')
        .select('id')
        .eq('eventId', eventId);
    if (error)
        throw error;
    return data.length;
};
exports.getNumOfTeams = getNumOfTeams;
const getAllColumnValueById = async (props) => {
    const { id } = props;
    const { data, error } = await supabase_1.supabase.from('Teams').select().eq('id', id);
    if (error)
        throw error;
    return data;
};
exports.getAllColumnValueById = getAllColumnValueById;
const getTeamLeaderUsernameDiscordId = async (props) => {
    const { teamId } = props;
    const { data: teamLeaderIdData, error: teamLeaderIdError } = await supabase_1.supabase
        .from('Teams')
        .select('teamLeader')
        .eq('id', teamId);
    const discordId = await (0, users_1.getUsernameAndDiscordId)({
        userId: teamLeaderIdData[0]['teamLeader'],
    });
    return discordId;
};
exports.getTeamLeaderUsernameDiscordId = getTeamLeaderUsernameDiscordId;
