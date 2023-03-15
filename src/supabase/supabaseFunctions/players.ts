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

	console.log(props);

	const { data: checkUserExistsData, error: checkUserExistsError } =
		await checkUserExists({
			userId: userId,
		});

	console.log({ checkUserExistsData, checkUserExistsError });

	// if user exists in DB
	if (!checkUserExistsError) {
		console.log('here');
		const { data, error } = await supabase.from('SinglePlayers').insert([
			{
				username: username,
				eventId: eventId,
				userId: userId,
			},
		]);

		if (error) throw error;

		return { data, error };

		// if user does not exist in DB
	} else {
		const { data: addUserData, error: addUserError } = await addUser({
			username: username,
			userId: userId,
		});

		console.log({ addUserData, addUserError });

		if (addUserError) throw addUserError;

		// if user was added successfully
		if (!addUserError) {
			const { data, error } = await supabase.from('SinglePlayers').insert([
				{
					username: username,
					eventId: eventId,
					userId: userId,
				},
			]);

			if (error) throw error;

			return { data, error };
		}
	}
};
