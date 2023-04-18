/* 

* This file contains all the 'servers' table related functions
*
*

*/

import { supabase } from '../supabase';
import psqlErrorCodes from '../../data/psqlErrorCodes.json';

interface checkServerExists {
	discordServerId: string;
}

interface addServer {
	serverId: string;
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
	const { serverId, name } = props;

	const { data, error } = await supabase
		.from('DiscordServers')
		.insert([{ serverId: serverId, name: name }])
		.select();

	return { data, error };
};

export const getServerId = async (props: getServer) => {
	const { discordServerId } = props;

	const { data, error } = await supabase
		.from('DiscordServers')
		.select('id')
		.eq('serverId', discordServerId);

	return { data, error };
};
