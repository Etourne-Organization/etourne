/* 

* This file contains all the 'roles' table related functions
*
*

*/

import { supabase } from '../supabase';

interface getRole {
	roleName: string;
}

export const getRoleId = async (props: getRole) => {
	const { roleName } = props;

	const { data, error } = await supabase
		.from('Roles')
		.select('id')
		.eq('name', roleName);

	return { data, error };
};
