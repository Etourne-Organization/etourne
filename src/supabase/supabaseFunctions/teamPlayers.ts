/* 

* This file contains all the 'team players' table related functions
*
*

*/

import { supabase } from '../supabase';
import { addUser, getUserId } from './users';

interface addPlayer {
	userId: number;
	teamId: number;
	serverId: number;
	username: string;
}

interface removePlayer {
	userId: number;
	teamId: number;
}

export const addPlayer = async (props: addPlayer) => {
	const { userId, teamId, serverId, username } = props;

	let dbUserId: number;

	// get user ID from DB
	const { data: getUserIdData, error: getUserIdError } = await getUserId({
		userId: userId,
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

	const { data, error } = await supabase.from('TeamPlayers').insert([
		{
			teamId: teamId,
			userId: dbUserId,
		},
	]);

	if (error) throw error;

	return { data, error };
};

export const removePlayer = async (props: removePlayer) => {
	const { userId, teamId } = props;

	// get user ID from DB
	const { data: getUserIdData, error: getUserIdError } = await getUserId({
		userId: userId,
	});

	const { data, error } = await supabase
		.from('TeamPlayers')
		.delete()
		.eq('userId', getUserIdData![0]['id'])
		.eq('teamId', teamId);

	if (error) throw error;

	console.log(data, error);

	return { data, error };
};
