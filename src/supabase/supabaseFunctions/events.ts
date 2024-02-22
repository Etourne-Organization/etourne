/* 

* This file contains all the 'events' table related functions
*
*

*/

import { supabase } from '../supabase';
import { getServerId } from './servers';

interface addEvent {
	eventId?: number;
	eventName: string;
	gameName: string;
	eventHost: string;
	description: string;
	dateTime: string;
	isTeamEvent: boolean;
	discordServerId: string;
	timezone: string;
	channelId: string;
	discordServerName: string;
}

interface setColumnValue {
	data: { key: string; value: string | number; id: number }[];
}

interface getColumnValueById {
	columnName: string;
	id: number;
}

interface deletEvent {
	eventId: number;
}

interface getAllColumnValueById {
	id: number;
}

interface updateEvent {
	eventId: number;
	eventName: string;
	gameName: string;
	description: string;
	dateTime: string | null;
	isTeamEvent: boolean;
	discordServerId: string;
	timezone: string;
}

interface getAllServerEvents {
	discordServerId: string;
}

export const addEvent = async (props: addEvent) => {
	const {
		eventName,
		gameName,
		eventHost,
		description,
		dateTime,
		isTeamEvent,
		discordServerId,
		timezone,
		channelId,
		discordServerName,
	} = props;

	let dbServerId: number;

	const { data: getServerIdData, error: getServerIdError } = await getServerId(
		{
			discordServerId: discordServerId,
		},
	);

	dbServerId = getServerIdData![0]['id'];

	const { data, error } = await supabase
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
				channelId: channelId,
			},
		])
		.select();

	if (error) throw `events:addEvent ${error}`;

	return data[0]['id'];
};

export const updateEvent = async (props: updateEvent) => {
	const {
		eventName,
		eventId,
		gameName,
		description,
		dateTime,
		isTeamEvent,
		discordServerId,
		timezone,
	} = props;

	const { data: getServerIdData, error: getServerIdError } = await getServerId(
		{
			discordServerId: discordServerId,
		},
	);

	const { data, error } = await supabase
		.from('Events')
		.update([
			{
				eventName: eventName,
				gameName: gameName,
				description: description,
				isTeamEvent: isTeamEvent,
				serverId: getServerIdData![0]['id'],
				timezone: timezone,
			},
		])
		.eq('id', eventId)
		.select();

	if (dateTime) {
		const { data, error } = await supabase
			.from('Events')
			.update([
				{
					dateTime: dateTime,
				},
			])
			.eq('id', eventId);

		if (error) throw `events:updateEvent ${error}`;
	}

	if (error) throw `events:updateEvent ${error}`;

	return data[0]['id'];
};

export const setColumnValue = async (props: setColumnValue) => {
	const { data } = props;

	const errorList = [];

	for (const d of data) {
		const { data, error } = await supabase
			.from('Events')
			.update({
				[d.key]: d.value,
			})
			.eq('id', d.id);

		if (error) errorList.push(error);
	}

	if (errorList.length > 0)
		throw `events:setColumnValue ${errorList.toString()}`;
};

export const getColumnValueById = async (props: getColumnValueById) => {
	const { columnName, id } = props;

	const { data, error } = await supabase
		.from('Events')
		.select(columnName)
		.eq('id', id);

	if (error) throw `events:getColumnValueById ${error}`;

	return data;
};

export const deleteEvent = async (props: deletEvent) => {
	const { eventId } = props;

	const { data, error } = await supabase
		.from('Events')
		.delete()
		.eq('id', eventId);

	if (error) throw `events:deleteEvent ${error}`;

	return { data, error };
};

export const getAllColumnValueById = async (props: getAllColumnValueById) => {
	const { id } = props;

	const { data, error } = await supabase.from('Events').select().eq('id', id);

	if (error) throw `events:getAllColumnValueById ${error}`;

	return data;
};

export const getAllServerEvents = async (props: getAllServerEvents) => {
	const { discordServerId } = props;

	const { data: getServerIdData, error: getServerIdError } = await getServerId(
		{
			discordServerId,
		},
	);

	if (getServerIdError) throw getServerIdError;

	const { data, error } = await supabase
		.from('Events')
		.select('*')
		.eq('serverId', getServerIdData![0]['id']);

	if (error) throw `events:getAllServerEvents ${error}`;

	return data;
};
