"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumOfTeamPlayers = exports.getAllTeamPlayers = exports.removePlayer = exports.addPlayer = void 0;
const supabase_1 = require("../supabase");
const users_1 = require("./users");
const addPlayer = async (props) => {
    const { discordUserId, teamId, discordServerId, username } = props;
    let dbUserId;
    const { data: getUserIdData, error: getUserIdError } = await (0, users_1.getUserId)({
        discordUserId: discordUserId,
    });
    if (getUserIdData.length < 1) {
        const { data: addUserData, error: addUserError } = await (0, users_1.addUser)({
            username: username,
            discordUserId: discordUserId,
            discordServerId: discordServerId,
        });
        dbUserId = addUserData[0]['id'];
    }
    else {
        dbUserId = getUserIdData[0]['id'];
    }
    const { data, error } = await supabase_1.supabase.from('TeamPlayers').insert([
        {
            teamId: teamId,
            userId: dbUserId,
        },
    ]);
    if (error)
        throw error;
    return { data, error };
};
exports.addPlayer = addPlayer;
const removePlayer = async (props) => {
    const { discordUserId, teamId } = props;
    const { data: getUserIdData, error: getUserIdError } = await (0, users_1.getUserId)({
        discordUserId: discordUserId,
    });
    const { data, error } = await supabase_1.supabase
        .from('TeamPlayers')
        .delete()
        .eq('userId', getUserIdData[0]['id'])
        .eq('teamId', teamId);
    if (error)
        throw error;
    return { data, error };
};
exports.removePlayer = removePlayer;
const getAllTeamPlayers = async (props) => {
    const { teamId } = props;
    let players = [];
    const { data, error } = await supabase_1.supabase
        .from('TeamPlayers')
        .select('userId')
        .eq('teamId', teamId);
    for (const d of data) {
        const us = await (0, users_1.getUsernameAndDiscordId)({
            userId: d.userId,
        });
        players.push({
            username: us[0]['username'],
            userId: us[0]['userId'].toString(),
        });
    }
    return players;
};
exports.getAllTeamPlayers = getAllTeamPlayers;
const getNumOfTeamPlayers = async (props) => {
    const { teamId } = props;
    const { data, error } = await supabase_1.supabase
        .from('TeamPlayers')
        .select('id')
        .eq('teamId', teamId);
    if (error)
        throw error;
    return data.length;
};
exports.getNumOfTeamPlayers = getNumOfTeamPlayers;
