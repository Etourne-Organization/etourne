/* 

* This file contains all the 'users' table related functions
*
*

*/

import { supabase } from '../supabase';

interface checkUserExists {
	userId: number;
}

interface addUser {
	userId: number;
	username: string;
	roleName?: string;
}

export const checkUserExists = async (props: checkUserExists) => {
	const { userId } = props;

	const { data, error } = await supabase
		.from('Users')
		.select('id')
		.eq('id', userId);

	return { data, error };
};

export const addUser = async (props: addUser) => {
	const { username, userId } = props;

	const { data, error } = await supabase
		.from('Users')
		.upsert([{ id: userId, username: username }]);

	return { data, error };
};
