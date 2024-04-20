import commandIds from '../commandIds';

export enum MessageType {
	LONG,
	SHORT,
}

const errorMessageTemplate = ({
	messageType = MessageType.LONG,
}: {
	messageType?: MessageType;
} = {}): { title: string; description?: string } => {
	let message: { title: string; description?: string } = {
		title: '',
		description: '',
	};

	switch (messageType) {
		case MessageType.LONG: {
			message = {
				title: ':x: There has been an error',
				description: `- Recently Discord has changed its API to remove hashtag from usernames (\`#0001\`) and our Database has been storing usernames with hashtags which could be the cause of this error. \n- If you are the user who added the bot into the server, you can run </registeradmin:${commandIds.REGISTER_ADMIN}> to re-register yourself in the database again\n- You can also run </registerserver:${commandIds.REGISTER_SERVER}> to make sure your server is registered in Etourne DB.`,
			};
		}

		case MessageType.SHORT: {
			message = {
				title: ':x: There has been an error',
				description: `Please contact your admin or join the [support](https://discord.gg/vNe9QVrWNa) server to raise this issue.`,
			};
		}

		default: {
			message = {
				title: ':x: There has been an error',
				description: `- Recently Discord has changed its API to remove hashtag from usernames (\`#0001\`) and our Database has been storing usernames with hashtags which could be the cause of this error. \n- If you are the user who added the bot into the server, you can run </registeradmin:${commandIds.REGISTER_ADMIN}> to re-register yourself in the database again\n- You can also run </registerserver:${commandIds.REGISTER_SERVER}> to make sure your server is registered in Etourne DB.`,
			};
		}
	}

	return message;
};

export default errorMessageTemplate;
