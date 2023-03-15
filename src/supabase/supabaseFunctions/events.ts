/* 

* This file contains all the 'events' table related functions
*
*

*/

import { supabase } from '../supabase';
import { checkServerExists, addServer } from './servers';
import psqlErrorCodes from '../../data/psqlErrorCodes.json';

interface addEvent {
	eventName: string;
	description: string;
	dateTime: string;
	isTeamEvent: boolean;
	serverId: number;
	timezone: string;
	numTeamLimit?: number;
	numTeamPlayerLimit?: number;
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
		numTeamPlayerLimit,
		serverName,
	} = props;

	const { data: checkServerExistsData, error: checkServerExistsError } =
		await checkServerExists({
			serverId: serverId,
		});

	// if server exists in DB
	if (!checkServerExistsError && checkServerExistsData) {
		const { data, error } = await supabase.from('Events').insert([
			{
				eventName: eventName,
				description: description,
				dateTime: dateTime,
				isTeamEvent: isTeamEvent,
				serverId: serverId,
				timezone: timezone,
				numTeamLimit: numTeamLimit,
				numTeamPlayerLimit: numTeamPlayerLimit,
			},
		]);

		if (error) throw error;

		return { data, error };

		// if server does not exist in DB
	} else if (checkServerExistsError && !checkServerExistsData) {
		const { data: addServerData, error: addServerError } = await addServer({
			serverId: serverId,
			name: serverName,
		});

		// if server was added successfully to DB
		if (!addServerError && addServerData) {
			const { data, error } = await supabase.from('Events').insert([
				{
					eventName: eventName,
					description: description,
					dateTime: dateTime,
					isTeamEvent: isTeamEvent,
					serverId: serverId,
					timezone: timezone,
					numTeamLimit: numTeamLimit,
					numTeamPlayerLimit: numTeamPlayerLimit,
				},
			]);

			if (error) throw error;

			return { data, error };
		}

		return { data: addServerData, error: addServerError };
	}
};
