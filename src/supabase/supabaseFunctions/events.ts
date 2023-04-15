/* 

* This file contains all the 'events' table related functions
*
*

*/

import { supabase } from '../supabase';
import { addServer } from './servers';
import psqlErrorCodes from '../../data/psqlErrorCodes.json';

interface addEvent {
	eventId?: number;
	eventName: string;
	description: string;
	dateTime: string;
	isTeamEvent: boolean;
	serverId: number;
	timezone: string;
	numTeamLimit?: number;
	numTeamMemberLimit?: number;
	serverName: string;
	messageId?: number;
}

interface setColumnValue {
	data: [{ key: string; value: string | number; id: number }];
}

interface getColumnValueById {
	columnName: string;
	id: number;
}

interface deletEvent {
	eventId: number;
}

export const addEvent = async (props: addEvent) => {
	const {
		eventName,
		description,
		dateTime,
		isTeamEvent,
		serverId,
		timezone,
		numTeamLimit,
		numTeamMemberLimit,
		serverName,
		messageId,
	} = props;

	const { data: addServerData, error: addServerError } = await addServer({
		serverId: serverId,
		name: serverName,
	});

	const { data, error } = await supabase
		.from('Events')
		.insert([
			{
				eventName: eventName,
				description: description,
				dateTime: dateTime,
				isTeamEvent: isTeamEvent,
				serverId: serverId,
				timezone: timezone,
				numTeamLimit: numTeamLimit,
				numTeamMemberLimit: numTeamMemberLimit,
			},
		])
		.select();

	if (error) throw error;

	return data[0]['id'];
};

export const setColumnValue = async (props: setColumnValue) => {
	const { data } = props;

	for (const d of data) {
		const { data, error } = await supabase
			.from('Events')
			.update({
				[d.key]: d.value,
			})
			.eq('id', d.id);
	}
};

export const getColumnValueById = async (props: getColumnValueById) => {
	const { columnName, id } = props;

	const { data, error } = await supabase
		.from('Events')
		.select(columnName)
		.eq('id', id);

	if (error) throw error;

	return data[0];
};

export const deleteEvent = async (props: deletEvent) => {
	const { eventId } = props;

	const { data, error } = await supabase
		.from('Events')
		.delete()
		.eq('id', eventId);

	if (error) throw error;

	return { data, error };
};
