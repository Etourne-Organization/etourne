"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllColumnValueById = exports.deleteEvent = exports.getColumnValueById = exports.setColumnValue = exports.updateEvent = exports.addEvent = void 0;
const supabase_1 = require("../supabase");
const servers_1 = require("./servers");
const addEvent = async (props) => {
    const { eventName, gameName, eventHost, description, dateTime, isTeamEvent, discordServerId, timezone, serverName, } = props;
    const isServerExist = await (0, servers_1.checkServerExists)({
        discordServerId: discordServerId,
    });
    let dbServerId;
    const { data: getServerIdData, error: getServerIdError } = await (0, servers_1.getServerId)({
        discordServerId: discordServerId,
    });
    dbServerId = getServerIdData[0]['id'];
    const { data, error } = await supabase_1.supabase
        .from('Events')
        .insert([
        {
            eventName: eventName,
            eventHost: eventHost,
            gameName: gameName,
            description: description,
            dateTime: dateTime,
            isTeamEvent: isTeamEvent,
            serverId: dbServerId,
            timezone: timezone,
        },
    ])
        .select();
    if (error)
        throw error;
    return data[0]['id'];
};
exports.addEvent = addEvent;
const updateEvent = async (props) => {
    const { eventName, eventId, gameName, description, dateTime, isTeamEvent, discordServerId, timezone, } = props;
    const { data: getServerIdData, error: getServerIdError } = await (0, servers_1.getServerId)({
        discordServerId: discordServerId,
    });
    const { data, error } = await supabase_1.supabase
        .from('Events')
        .update([
        {
            eventName: eventName,
            gameName: gameName,
            description: description,
            dateTime: dateTime,
            isTeamEvent: isTeamEvent,
            serverId: getServerIdData[0]['id'],
            timezone: timezone,
        },
    ])
        .eq('id', eventId)
        .select();
    if (error)
        throw error;
    return data[0]['id'];
};
exports.updateEvent = updateEvent;
const setColumnValue = async (props) => {
    const { data } = props;
    for (const d of data) {
        const { data, error } = await supabase_1.supabase
            .from('Events')
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
        .from('Events')
        .select(columnName)
        .eq('id', id);
    if (error)
        throw error;
    return data;
};
exports.getColumnValueById = getColumnValueById;
const deleteEvent = async (props) => {
    const { eventId } = props;
    const { data, error } = await supabase_1.supabase
        .from('Events')
        .delete()
        .eq('id', eventId);
    if (error)
        throw error;
    return { data, error };
};
exports.deleteEvent = deleteEvent;
const getAllColumnValueById = async (props) => {
    const { id } = props;
    const { data, error } = await supabase_1.supabase.from('Events').select().eq('id', id);
    if (error)
        throw error;
    return data;
};
exports.getAllColumnValueById = getAllColumnValueById;
