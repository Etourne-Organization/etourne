import originalCommandIDs from '../ORIGINAL_COMMAND_IDS/commandIDs.json';
import testCommandIDs from '../TEST_COMMAND_IDS/commandIDs.json';

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
				description: `- Recently Discord has changed its API to remove hashtag from usernames (\`#0001\`) and our Database has been storing usernames with hashtags which could be the cause of this error. \n- If you are the user who added the bot into the server, you can run ${
					process.env.COMMAND_ID === 'TEST_COMMAND_IDS'
						? `</registerserver:${testCommandIDs.REGISTER_ADMIN}>`
						: `</registerserver:${
								originalCommandIDs.REGISTER_ADMIN
						  }> to re-register yourself in the database again\n- You can also run ${
								process.env.COMMAND_ID === 'TEST_COMMAND_IDS'
									? `</registerserver:${testCommandIDs.REGISTER_SERVER}>`
									: `</registerserver:${originalCommandIDs.REGISTER_SERVER}>`
						  } to make sure your server is registered in Etourne DB.`
				}`,
			};
		}
		case MessageType.SHORT: {
			message = {
				title: ':x: There has been an error',
				description: `Please contact your admin or join the [support](https://discord.gg/vNe9QVrWNa) server to raise this issue.`,
			};
		}
	}

	return message;
};

export default errorMessageTemplate;
