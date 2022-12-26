# Etourne

## Instruction to setup the test version of the bot

1. Clone the repo
1. Create `logs` folder in the root directory as well as two files inside it:
   1. `restart.txt`
   2. `crash_logs.txt`
1. Make sure to create a .env file (the gist for it can be found from the pinned message in the Noob Dev Official test channel)

   An example of .env (you can also follow the example in `.env.example`):

   ```env
      PREFIX=<
      DISCORDJS_BOT_TOKEN=<TEST_BOT_TOKEN>
      BOT_IDS=TEST_BOT_IDS
      GUILD_ID=<GUILD_WHERE_THE_BOT_IS_BEING_TESTED>
   ```

1. Make sure to have [NodeJS](https://nodejs.org/en/) (v16.6.0 and above) and [nodemon](https://www.npmjs.com/package/nodemon) installed.
1. To start the bot, run: `nodemon src/bot.ts` (make sure to be in the directory).

## Instruction to setup the bot in production

1. Clone the repo.
2. Create `logs` folder in the root directory as well as two files inside it:
   1. `restart.txt`
   2. `crash_logs.txt`
3. Follow the template in `.env.example` and create `.env` file (`GUILD_ID` is not needed).
4. Start the server (or use [Forever](https://www.npmjs.com/package/forever) module).
