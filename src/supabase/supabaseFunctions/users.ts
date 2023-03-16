/* 

* This file contains all the 'users' table related functions
*
*

*/

import { supabase } from '../supabase';

interface addUser {
	userId: number;
	username: string;
	roleName?: string;
}

export const addUser = async (props: addUser) => {
	const { username, userId } = props;

	const { data, error } = await supabase
		.from('Users')
		.upsert([{ id: userId, username: username }]);

	return { data, error };
};
