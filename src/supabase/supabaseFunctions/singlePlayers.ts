/* 

* This file contains all the 'single players' table related functions
*
*

*/

import { supabase } from '../supabase';
import { addUser, getUserId } from './users';

interface addPlayer {
	username: string;
	userId: number;
	eventId: number;
	serverId?: number;
}

interface removePlayer {
	username?: string;
	userId: number;
	eventId: number;
}

export const addPlayer = async (props: addPlayer) => {
	const { username, userId, eventId, serverId } = props;

	let dbUserId: number;

	// get user ID from DB
	const { data: getUserIdData, error: getUserIdError } = await getUserId({
		discordUserId: userId,
	});

	// add user to the Supabase DB if the user does not exist
	if (getUserIdData!.length < 1) {
		const { data: addUserData, error: addUserError } = await addUser({
			username: username,
			userId: userId,
			serverId: serverId!,
		});

		dbUserId = addUserData![0]['id'];
	} else {
		dbUserId = getUserIdData![0]['id'];
	}

	const { data, error } = await supabase.from('SinglePlayers').insert([
		{
			eventId: eventId,
			userId: dbUserId,
		},
	]);

	if (error) throw error;

	return { data, error };
};

export const removePlayer = async (props: removePlayer) => {
	const { userId, eventId } = props;

	// get user ID from DB
	const { data: getUserIdData, error: getUserIdError } = await getUserId({
		discordUserId: userId,
	});

	const { data, error } = await supabase
		.from('SinglePlayers')
		.delete()
		.eq('userId', getUserIdData![0]['id'])
		.eq('eventId', eventId);

	if (error) throw error;

	return { data, error };
};
