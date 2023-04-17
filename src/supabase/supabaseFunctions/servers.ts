/* 

* This file contains all the 'servers' table related functions
*
*

*/

import { supabase } from '../supabase';
import psqlErrorCodes from '../../data/psqlErrorCodes.json';

interface checkServerExists {
	serverId: string;
}

interface addServer {
	serverId: string;
	name: string;
}

interface getServer {
	serverId: string;
}

export const checkServerExists = async (props: checkServerExists) => {
	const { serverId } = props;

	const { data, error } = await supabase
		.from('DiscordServers')
		.select('id')
		.containedBy('id', [serverId]);

	// console.log({ data, error });

	return { data, error };
};

export const addServer = async (props: addServer) => {
	const { serverId, name } = props;

	const { data, error } = await supabase
		.from('DiscordServers')
		.upsert([{ id: serverId, name: name }]);

	return { data, error };
};

export const getServerId = async (props: getServer) => {
	const { serverId } = props;

	const { data, error } = await supabase
		.from('DiscordServers')
		.select('id')
		.eq('id', serverId);

	return { data, error };
};
