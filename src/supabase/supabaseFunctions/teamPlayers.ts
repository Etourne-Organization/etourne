/* 

* This file contains all the 'team players' table related functions
*
*

*/

import { supabase } from '../supabase';
import { addUser } from './users';

interface addPlayer {
	username: string;
	userId: number;
	eventId: number;
	serverId: string;
}

interface removePlayer {
	username?: string;
	userId: number;
	eventId: number;
}

export const addPlayer = async (props: addPlayer) => {
	const { username, userId, eventId, serverId } = props;

	const { data: addUserData, error: addUserError } = await addUser({
		username: username,
		userId: userId,
		serverId: serverId,
	});

	const { data, error } = await supabase.from('SinglePlayers').insert([
		{
			username: username,
			eventId: eventId,
			userId: userId,
		},
	]);

	if (error) throw error;

	return { data, error };
};

export const removePlayer = async (props: removePlayer) => {
	const { username, userId, eventId } = props;

	const { data, error } = await supabase
		.from('SinglePlayers')
		.delete()
		.eq('userId', userId)
		.eq('eventId', eventId);

	if (error) throw error;

	console.log(data, error);

	return { data, error };
};