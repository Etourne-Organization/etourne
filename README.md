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

1. Install all the packages using: `npm install`.
1. Make sure to have [NodeJS](https://nodejs.org/en/) (v16.6.0 and above) and [nodemon](https://www.npmjs.com/package/nodemon) installed.
1. To start the bot, run: `nodemon src/bot.ts` (make sure to be in the directory).

## Instruction to setup the bot in production

1. Clone the repo.
2. Create `logs` folder in the root directory as well as two files inside it:
   1. `restart.txt`
   2. `crash_logs.txt`
3. Follow the template in `.env.example` and create `.env` file (`GUILD_ID` is not needed).
4. Install all the packages using: `npm install`.
5. To start the bot, run: `pm2 start ecosystem.config.js`. **Make sure to setup [PM2](https://pm2.io/) beforehand**.

## Instruction to self host Supabase

Supabase provides in-depth explanation about self hosting on their [website](https://supabase.com/docs/guides/self-hosting/docker). Below is the summary of what needs to be done with this app:

1. Create an account on [Doppler](https://www.doppler.com/). This is going to be used for storing `.env` secrets (most of them).
2. Create a project in Doppler.
3. Generate JWT_SECRET, ANON_KEY, SERVICE_ROLE_KEY and POSTGRES_PASSWORD using the [generator in Supabase](https://supabase.com/docs/guides/self-hosting#api-keys).
4. Hardcode the ANON_KEY and SERVICE_ROLE_KEY in `volumes/api/kong.yml` (**for now**).
5. Put them in the PROD of your project in Doppler dashboard.
6. Install Doppler CLI by following this [guide/documentation](https://docs.doppler.com/docs/install-cli).
7. Login into your Doppler account from CLI using `doppler login`. Follow the steps on your terminal.
8. Go to `supabase/docker` directory and setup your doppler project locally using `doppler setup`.
9. Install Docker to your server/machine by following this [guide/documentation](https://docs.docker.com/get-docker/).
10.   Setup Doppler project in your local machine by following this [instruction](https://docs.doppler.com/docs/install-cli#project-setup).
11.   Run the following command to spin up Supabase: `doppler run -- docker compose up -d`.
