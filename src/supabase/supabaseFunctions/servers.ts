/* 

* This file contains all the 'servers' table related functions
*
*

*/

import { supabase } from '../supabase';
import psqlErrorCodes from '../../data/psqlErrorCodes.json';

interface checkServerExists {
	serverId: number;
}

interface addServer {
	serverId: number;
	name: string;
}

export const checkServerExists = async (props: checkServerExists) => {
	const { serverId } = props;

	const { data, error } = await supabase
		.from('Servers')
		.select('id')
		.containedBy('id', [serverId]);

	console.log({ data, error });

	return { data, error };
};

export const addServer = async (props: addServer) => {
	const { serverId, name } = props;

	const { data, error } = await supabase
		.from('Servers')
		.upsert([{ id: serverId, name: name }]);

	return { data, error };
};