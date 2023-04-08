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

	// return { data, error };
	return data[0]['id'];
};
