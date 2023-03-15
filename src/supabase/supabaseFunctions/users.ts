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
	role: string;
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
	const { username, role, userId } = props;

	const { data, error } = await supabase
		.from('Users')
		.insert([{ id: userId, username: username, role: role }]);

	return { data, error };
};
