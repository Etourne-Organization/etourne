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

	if (error) throw `servers:checkServerExists ${error}`;

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

	if (error) throw `servers:addServer ${error}`;

	return { data, error };
};

export const checkAddServer = async (props: checkAddServer) => {
	const { discordServerId, name } = props;

	if (!(await checkServerExists({ discordServerId: discordServerId }))) {
		const { data, error } = await addServer({
			discordServerId: discordServerId,
			name: name,
		});

		if (error) throw `servers:checkAddServer ${error}`;
	}
};

export const getServerId = async (props: getServer) => {
	const { discordServerId } = props;

	const { data, error } = await supabase
		.from('DiscordServers')
		.select('id')
		.eq('serverId', discordServerId);

	if (error) throw `servers:getServerId ${error}`;

	return { data, error };
};
