/* 

* This file contains all the 'roles' table related functions
*
*

*/

import { throwFormattedErrorLog } from 'utils/logging/errorFormats';
import { supabase } from 'supabaseDB/index';

interface getRole {
	roleName: string;
}

export const getRoleId = async (props: getRole) => {
	const { roleName } = props;

	const { data, error } = await supabase
		.from('Roles')
		.select('id')
		.eq('name', roleName);

	if (error) throw throwFormattedErrorLog(error);

	return { data, error };
};
