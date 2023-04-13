/* 

* This file contains all the 'teams' table related functions
*
*

*/

import { supabase } from '../supabase';

interface addTeam {
	eventId: number;
	teamName: string;
	teamDescription: string;
}

interface deleteTeam {
	teamId: number;
}

export const addTeam = async (props: addTeam) => {
	const { eventId, teamName, teamDescription } = props;

	const { data, error } = await supabase
		.from('Teams')
		.insert([
			{
				name: teamName,
				description: teamDescription,
				eventId: eventId,
			},
		])
		.select();

	if (error) throw error;

	// return { data, error };
	return data[0]['id'];
};

export const deleteTeam = async (props: deleteTeam) => {
	const { teamId } = props;

	const { data, error } = await supabase
		.from('Teams')
		.delete()
		.eq('id', teamId);

	return { data, error };
};
