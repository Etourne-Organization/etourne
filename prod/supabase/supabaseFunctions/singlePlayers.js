"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumOfPlayers = exports.getAllPlayers = exports.removePlayer = exports.addPlayer = void 0;
const supabase_1 = require("../supabase");
const users_1 = require("./users");
const addPlayer = async (props) => {
    const { username, discordUserId, eventId, discordServerId } = props;
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
    const { data, error } = await supabase_1.supabase.from('SinglePlayers').insert([
        {
            eventId: eventId,
            userId: dbUserId,
        },
    ]);
    if (error)
        throw error;
    return { data, error };
};
exports.addPlayer = addPlayer;
const removePlayer = async (props) => {
    const { discordUserId, eventId } = props;
    const { data: getUserIdData, error: getUserIdError } = await (0, users_1.getUserId)({
        discordUserId: discordUserId,
    });
    const { data, error } = await supabase_1.supabase
        .from('SinglePlayers')
        .delete()
        .eq('userId', getUserIdData[0]['id'])
        .eq('eventId', eventId);
    if (error)
        throw error;
    return { data, error };
};
exports.removePlayer = removePlayer;
const getAllPlayers = async (props) => {
    const { eventId } = props;
    let players = [];
    const { data, error } = await supabase_1.supabase
        .from('SinglePlayers')
        .select('userId')
        .eq('eventId', eventId);
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
exports.getAllPlayers = getAllPlayers;
const getNumOfPlayers = async (props) => {
    const { eventId } = props;
    const { data, error } = await supabase_1.supabase
        .from('SinglePlayers')
        .select('id')
        .eq('eventId', eventId);
    if (error)
        throw error;
    return data.length;
};
exports.getNumOfPlayers = getNumOfPlayers;
