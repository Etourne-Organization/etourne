/* 

* This file contains all the 'team players' table related functions
*
*

*/

import { supabase } from '../supabase';
import { addUser, getUserId, getUsername } from './users';

interface addPlayer {
	userId: number;
	teamId: number;
	serverId: number;
	username: string;
}

interface removePlayer {
	discordUserId: number;
	teamId: number;
}

interface getAllTeamPlayers {
	teamId: number;
}

export const addPlayer = async (props: addPlayer) => {
	const { userId, teamId, serverId, username } = props;

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
	const { discordUserId, teamId } = props;

	// get user ID from DB
	const { data: getUserIdData, error: getUserIdError } = await getUserId({
		discordUserId: discordUserId,
	});

	const { data, error } = await supabase
		.from('TeamPlayers')
		.delete()
		.eq('userId', getUserIdData![0]['id'])
		.eq('teamId', teamId);

	if (error) throw error;

	return { data, error };
};

export const getAllTeamPlayers = async (props: getAllTeamPlayers) => {
	const { teamId } = props;

	let usernames: [string?] = [];

	const { data, error } = await supabase
		.from('TeamPlayers')
		.select('userId')
		.eq('teamId', teamId);

	for (const d of data!) {
		const us: [{ username: string }] | any = await getUsername({
			userId: d.userId,
		});
		usernames.push(us[0]['username']);
	}

	return usernames;
};
