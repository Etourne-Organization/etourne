/* 

* This file contains all the 'single players' table related functions
*
*

*/

import { throwFormattedErrorLog } from 'utils/logging/errorFormats';
import { supabase } from 'supabaseDB/index';
import { addUser, getUserId, getUsernameAndDiscordId } from './users';

interface addPlayer {
	username: string;
	discordUserId: string;
	eventId: number;
	discordServerId?: string;
}

interface removePlayer {
	username?: string;
	discordUserId: string;
	eventId: number;
}

interface getAllPlayers {
	eventId: number;
}

interface getNumOfPlayers {
	eventId: number;
}

export const addPlayer = async (props: addPlayer) => {
	const { username, discordUserId, eventId, discordServerId } = props;

	let dbUserId: number;

	// get user ID from DB
	const { data: getUserIdData, error: getUserIdError } = await getUserId({
		discordUserId: discordUserId,
	});

	// add user to the Supabase DB if the user does not exist
	if (getUserIdData!.length < 1) {
		const { data: addUserData, error: addUserError } = await addUser({
			username: username,
			discordUserId: discordUserId,
			discordServerId: discordServerId!,
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

	if (error) throw throwFormattedErrorLog(error);

	return { data, error };
};

export const removePlayer = async (props: removePlayer) => {
	const { discordUserId, eventId } = props;

	// get user ID from DB
	const { data: getUserIdData, error: getUserIdError } = await getUserId({
		discordUserId: discordUserId,
	});

	const { data, error } = await supabase
		.from('SinglePlayers')
		.delete()
		.eq('userId', getUserIdData![0]['id'])
		.eq('eventId', eventId);

	if (error) throw throwFormattedErrorLog(error);

	return { data, error };
};

export const getAllPlayers = async (props: getAllPlayers) => {
	const { eventId } = props;

	const players: [{ username: string; userId: string }?] = [];

	const { data, error } = await supabase
		.from('SinglePlayers')
		.select('userId')
		.eq('eventId', eventId);

	if (error) throw throwFormattedErrorLog(error);

	if (data)
		for (const d of data!) {
			const us: [{ username: string }] | any = await getUsernameAndDiscordId(
				{
					userId: d.userId,
				},
			);
			players.push({
				username: us[0]['username'],
				userId: us[0]['userId'].toString(),
			});
		}

	return players;
};

export const getNumOfPlayers = async (props: getNumOfPlayers) => {
	const { eventId } = props;

	const { data, error } = await supabase
		.from('SinglePlayers')
		.select('id')
		.eq('eventId', eventId);

	if (error) throw throwFormattedErrorLog(error);

	return data.length;
};
