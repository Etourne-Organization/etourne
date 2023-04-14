/* 

* This file contains all the 'users' table related functions
*
*

*/

import { supabase } from '../supabase';
import { getServerId } from './servers';

interface addUser {
	userId: number;
	username: string;
	roleName?: string;
	serverId: number;
}

interface getUserId {
	discordUserId: number;
}

interface getUsername {
	userId: number;
}

interface getMultipleUsernames {
	userIds: [number];
}

export const addUser = async (props: addUser) => {
	const { username, userId, serverId } = props;

	const { data: getServerIdData, error: getServerIdError } = await getServerId(
		{
			serverId: serverId,
		},
	);

	const { data, error } = await supabase
		.from('Users')
		.upsert([
			{
				userId: userId,
				username: username,
				serverId: getServerIdData![0]['id'],
			},
		])
		.select();

	return { data, error };
};

export const getUserId = async (props: getUserId) => {
	const { discordUserId } = props;

	const { data, error } = await supabase
		.from('Users')
		.select('id')
		.eq('userId', discordUserId);

	return { data, error };
};

export const getUsername = async (props: getUsername) => {
	const { userId } = props;

	const { data, error } = await supabase
		.from('Users')
		.select('username')
		.eq('id', userId);

	return data;
};

export const getMultipleUsernames = async (props: getMultipleUsernames) => {
	const { userIds } = props;

	const { data, error } = await supabase
		.from('Users')
		.select('username')
		.in('id', userIds);

	return data;
};
