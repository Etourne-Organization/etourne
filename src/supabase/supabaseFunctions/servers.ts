/* 

* This file contains all the 'servers' table related functions
*
*

*/

import { supabase } from '../supabase';

interface checkServerExists {
	discordServerId: string;
}

interface addServer {
	discordServerId: string;
	name: string;
}

interface checkAddServer {
	discordServerId: string;
	name: string;
}

interface getServer {
	discordServerId: string;
}

export const checkServerExists = async (props: checkServerExists) => {
	const { discordServerId } = props;

	const { data, error } = await supabase
		.from('DiscordServers')
		.select('id')
		.eq('serverId', discordServerId);

	if (data!.length > 0) {
		return true;
	} else {
		return false;
	}
};

export const addServer = async (props: addServer) => {
	const { discordServerId, name } = props;

	const { data, error } = await supabase
		.from('DiscordServers')
		.insert([{ serverId: discordServerId, name: name }])
		.select();

	return { data, error };
};

export const checkAddServer = async (props: checkAddServer) => {
	const { discordServerId, name } = props;

	if (!(await checkServerExists({ discordServerId: discordServerId }))) {
		const { data: addServerData, error: addServerError } = await addServer({
			discordServerId: discordServerId,
			name: name,
		});
	}
};

export const getServerId = async (props: getServer) => {
	const { discordServerId } = props;

	const { data, error } = await supabase
		.from('DiscordServers')
		.select('id')
		.eq('serverId', discordServerId);

	return { data, error };
};
