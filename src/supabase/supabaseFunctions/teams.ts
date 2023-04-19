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

interface checkTeamExists {
	teamId: number;
}

interface setColumnValue {
	data: [{ key: string; value: string | number; id: number }];
}

interface getColumnValueById {
	columnName: string;
	id: number;
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

export const checkTeamExists = async (props: checkTeamExists) => {
	const { teamId } = props;

	const { data, error } = await supabase
		.from('Teams')
		.select()
		.eq('id', teamId);

	if (error) throw error;

	if (data.length > 0) {
		return true;
	} else {
		return false;
	}
};

export const setColumnValue = async (props: setColumnValue) => {
	const { data } = props;

	for (const d of data) {
		const { data, error } = await supabase
			.from('Teams')
			.update({
				[d.key]: d.value,
			})
			.eq('id', d.id);
	}
};

export const getColumnValueById = async (props: getColumnValueById) => {
	const { columnName, id } = props;

	const { data, error } = await supabase
		.from('Teams')
		.select(columnName)
		.eq('id', id);

	if (error) throw error;

	return data;
};
