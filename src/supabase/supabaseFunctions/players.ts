/* 

* This file contains all the 'players' table related functions
*
*

*/

import { supabase } from '../supabase';
import { checkUserExists, addUser } from './users';

interface addPlayer {
	username: string;
	userId: number;
	eventId: number;
}

export const addPlayer = async (props: addPlayer) => {
	const { username, userId, eventId } = props;

	const { data: addUserData, error: addUserError } = await addUser({
		username: username,
		userId: userId,
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
