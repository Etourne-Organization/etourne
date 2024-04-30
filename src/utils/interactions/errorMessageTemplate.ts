import COMMAND_IDS from "../commandIds";

export enum MessageType {
  LONG,
  SHORT,
  V_SHORT,
}

const longErrorMessage = {
  title: ":x: There has been an error",
  description: `- Recently Discord has changed its API to remove the hashtag from usernames (\`#0001\`). Our database has been storing usernames with hashtags, which might cause this error. 
  \n- If you added the bot to the server, re-register yourself in the database with </registeradmin:${COMMAND_IDS.REGISTER_ADMIN}>. 
  \n- You can also run </registerserver:${COMMAND_IDS.REGISTER_SERVER}> to ensure your server is registered in Etourne DB.`,
};

const shortErrorMessage = {
  title: ":x: There has been an error",
  description: `Please contact your admin or join the [support](https://discord.gg/vNe9QVrWNa) server to raise this issue.`,
};

export const errorMessageTemplate = (messageType: MessageType = MessageType.LONG) => {
  switch (messageType) {
    case MessageType.SHORT:
      return shortErrorMessage;
    default:
      return longErrorMessage;
  }
};

export default errorMessageTemplate;
