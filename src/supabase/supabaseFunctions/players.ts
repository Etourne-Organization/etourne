/* 

* This file contains all the 'players' table related functions
*
*

*/

import { supabase } from '../supabase';

interface addPlayer {
	username: string;
	userId: number;
	eventId: number;
}

export const addPlayer = async (props: addPlayer) => {
	const { username, userId, eventId } = props;
};
