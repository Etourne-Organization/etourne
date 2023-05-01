/* 

* This file contains all the 'users' table related functions
*
*

*/

import { supabase } from '../supabase';
import { getServerId } from './servers';

interface addUser {
	discordUserId: string;
	username: string;
	roleName?: string;
	discordServerId: string;
}

interface checkAddUser {
	discordUserId: string;
	username: string;
	roleName?: string;
	discordServerId: string;
}

interface getUserId {
	discordUserId: string;
}

interface getUsername {
	userId: number;
}

interface getMultipleUsernames {
	userIds: [number];
}

export const addUser = async (props: addUser) => {
	const { username, discordUserId, discordServerId } = props;

	const { data: getServerIdData, error: getServerIdError } = await getServerId(
		{
			discordServerId: discordServerId,
		},
	);

	const { data, error } = await supabase
		.from('Users')
		.insert([
			{
				userId: discordUserId,
				username: username,
				serverId: getServerIdData![0]['id'],
			},
		])
		.select();

	return { data, error };
};

export const checkAddUser = async (props: checkAddUser) => {
	const { username, discordUserId, discordServerId } = props;

	// check whether user exists in DB
	const { data: checkUserExistsData, error: checkUserExistsError } =
		await supabase
			.from('Users')
			.select('id')
			.eq('userId', discordUserId)
			.eq('serverId', discordServerId);

	console.log(checkUserExistsData);

	if (checkUserExistsData?.length === 0) {
		await addUser({
			username: username,
			discordUserId: discordUserId,
			discordServerId: discordServerId,
		});
	}
};

export const getUserId = async (props: getUserId) => {
	const { discordUserId } = props;

	const { data, error } = await supabase
		.from('Users')
		.select('id')
		.eq('userId', discordUserId);

	return { data, error };
};

export const getUsernameAndDiscordId = async (props: getUsername) => {
	const { userId } = props;

	const { data, error } = await supabase
		.from('Users')
		.select('username, userId')
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
