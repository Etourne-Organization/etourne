/* 

* This file contains all the events related functions
*
*

*/

import { supabase } from '../supabase';

interface addEvent {
	eventName: string;
	description: string;
	dateTime: string;
	isTeamEvent: boolean;
	serverId: string;
	timezone: string;
	numTeamLimit?: number;
	numTeamPlayerLimit?: number;
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
	} = props;

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

	return { data, error };
};
