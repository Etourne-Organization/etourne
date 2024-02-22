/* 

* This file contains all the 'teams' table related functions
*
*

*/

import { supabase } from '../supabase';

import { checkAddUser, getUserId, getUsernameAndDiscordId } from './users';

interface addTeam {
	eventId: number;
	teamName: string;
	teamDescription: string;
	teamLeaderDiscordUserId: string;
	discordServerId: string;
	teamLeaderUsername: string;
}

interface updateTeam {
	id: number;
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

interface getColumnValueByEventId {
	columnName: string;
	eventId: number;
}

interface getNumOfTeam {
	eventId: number;
}

interface getAllColumnValueById {
	id: number;
}

interface getTeamLeader {
	teamId: number;
}

export const addTeam = async (props: addTeam) => {
	const {
		eventId,
		teamName,
		teamDescription,
		teamLeaderDiscordUserId,
		discordServerId,
		teamLeaderUsername,
	} = props;

	await checkAddUser({
		discordUserId: teamLeaderDiscordUserId,
		discordServerId: discordServerId,
		username: teamLeaderUsername,
	});

	const { data: getUserIdData, error: getUserIdError } = await getUserId({
		discordUserId: teamLeaderDiscordUserId,
	});

	if (getUserIdError) throw `teams:addTeam:getUserIdError ${getUserIdError}`;

	const { data, error } = await supabase
		.from('Teams')
		.insert([
			{
				name: teamName,
				description: teamDescription,
				eventId: eventId,
				teamLeader: getUserIdData![0]['id'],
			},
		])
		.select();

	if (error) throw `teams:addTeam ${error}`;

	// return { data, error };
	return data[0]['id'];
};

export const updateTeam = async (props: updateTeam) => {
	const { id, teamName, teamDescription } = props;

	const { data, error } = await supabase
		.from('Teams')
		.update([
			{
				name: teamName,
				description: teamDescription,
			},
		])
		.eq('id', id)
		.select();

	if (error) throw `teams:updateTeam ${error}`;

	// return { data, error };
	return data[0]['id'];
};

export const deleteTeam = async (props: deleteTeam) => {
	const { teamId } = props;

	const { data, error } = await supabase
		.from('Teams')
		.delete()
		.eq('id', teamId);

	if (error) throw `teams:deleteTeam ${error}`;

	return { data, error };
};

export const checkTeamExists = async (props: checkTeamExists) => {
	const { teamId } = props;

	const { data, error } = await supabase
		.from('Teams')
		.select()
		.eq('id', teamId);

	if (error) throw `teams:checkTeamExists ${error}`;

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

	if (error) throw `teams:getColumnValueById ${error}`;

	return data;
};

export const getColumnValueByEventId = async (
	props: getColumnValueByEventId,
) => {
	const { columnName, eventId } = props;

	const { data, error } = await supabase
		.from('Teams')
		.select(columnName)
		.eq('eventId', eventId);

	if (error) throw `teams:getColumnValueByEventId ${error}`;

	return data;
};

export const getNumOfTeams = async (props: getNumOfTeam) => {
	const { eventId } = props;

	const { data, error } = await supabase
		.from('Teams')
		.select('id')
		.eq('eventId', eventId);

	if (error) throw `teams:getNumOfTeams ${error}`;

	return data.length;
};

export const getAllColumnValueById = async (props: getAllColumnValueById) => {
	const { id } = props;

	const { data, error } = await supabase.from('Teams').select().eq('id', id);

	if (error) throw `teams:getAllColumnValueById ${error}`;

	return data;
};

export const getTeamLeaderUsernameDiscordId = async (props: getTeamLeader) => {
	const { teamId } = props;

	const { data: teamLeaderIdData, error } = await supabase
		.from('Teams')
		.select('teamLeader')
		.eq('id', teamId);

	if (error) throw `teams:getTeamLeaderUsernameDiscordId ${error}`;

	const discordId = await getUsernameAndDiscordId({
		userId: teamLeaderIdData![0]['teamLeader'],
	});

	return discordId;
};
