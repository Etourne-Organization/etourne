import fs from 'fs';

import { ModalSubmitInteraction } from 'discord.js';

import {
	getAllColumnValueById,
	getColumnValueByEventId,
} from '../../../../supabase/supabaseFunctions/teams';

interface updateAllTeamInfo {
	eventId: number;
	interaction: ModalSubmitInteraction;
}

const updateAllTeamInfo = async (props: updateAllTeamInfo) => {
	try {
		const { eventId, interaction } = props;

		const messageIds: any = await getColumnValueByEventId({
			eventId: eventId,
			columnName: 'id, messageId',
		});

		if (messageIds.length > 0) {
			for (const mId of messageIds) {
				const fetchedMessage = await interaction.channel?.messages.fetch(
					mId['messageId'],
				);

				const values = await getAllColumnValueById({
					id: mId['id'],
				});
			}
		}
	} catch (err) {
		try {
			fs.appendFile(
				'logs/crash_logs.txt',
				`${new Date()} : Something went wrong in modalFunctions/teamEvent/utils/updateAllTeamInfo.ts \n Actual error: ${err} \n \n`,
				(err) => {
					if (err) throw err;
				},
			);
		} catch (err) {
			console.log('Error logging failed');
		}
	}
};

export default updateAllTeamInfo;
