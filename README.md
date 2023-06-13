<h1>Etourne (Discord Bot)</h1>

## Architecture Diagram

<img src="./images/Etourne%20Architecture%20Diagram.png" style="border: 1px solid; margin: 10px 0;">

## Prerequisites

**Note for Windows:** This was tested on powershell which works properly.

### Setup Supabase project

1. Create an account on [Supabase](https://supabase.com/).
2. Create **two** projects:
   -  Etourne Production
   -  Etourne Development

### Setup Doppler

1. Create an account on [Doppler](https://www.doppler.com/). This is going to be used for storing `.env` secrets (most of them).
2. Create a project in your Doppler account and setup `PROD` and `DEV` environments. Follow [this](https://docs.doppler.com/docs/create-project) tutorial if you are stuck.
3. Create a project in Doppler.
4. Secrets required (for **both** the environments) are:
   1. COMMAND_ID: `TEST_COMMAND_IDS` (DEV) **or** `ORIGINAL_COMMAND_IDS` (PROD)
   2. DISCORD_CLIENT_ID: `your Discord BOT client ID (can be found on Discord Dev portal)`
   3. DISCORD_CLIENT_SECRET: `your Discord BOT client secret (can be found on Discord Dev portal)`
   4. DISCORDJS_BOT_TOKEN: `your Discord BOT token (can be found on Discord Dev portal)`
   5. GUILD_ID: `Discord server you are adding the bot in for testing the commands` (**only** for DEV)
   6. OWNER_ID: `your Discord User ID`
   7. PREFIX: `prefix to use legacy command(s)`
   8. SUPABASE_ANON_KEY: `Can be found from your Supabase project settings`
   9. SUPABASE_SERVICE_ROLE_KEY: `Can be found from your Supabase project settings`
   10.   SUPABASE_URL: `Can be found from your Supabase project settings`
5. Install Doppler CLI on your machine from [here](https://docs.doppler.com/docs/cli).
6. Login into your Doppler account from CLI using `doppler login`. Follow the steps on your terminal.
7. **Windows BUG with scoop:** Scoop needs to be added to the system user variable so that you can use scoop and the installed apps. Read this [GitHub issue](https://github.com/ScoopInstaller/Scoop/issues/3951) to learn more.
8. Make sure to have [NodeJS](https://nodejs.org/en/) (v16.14.0 and above) and [nodemon](https://www.npmjs.com/package/nodemon) installed.
9. Go to `etourne` directory and setup your doppler project locally using `doppler setup`.

## Instructions to setup the test version of the bot

1. Make sure you have followed **all** the steps in [prerequisites](#prerequisites).
2. Clone the repo
3. Create `logs` folder in the root directory as well as two files inside it:

   1. `restart.txt`
   2. `crash_logs.txt`

4. Install all the packages using: `npm install`.
5. To start the bot, run: `npm run start-doppler` (make sure to be in the directory).

## Instructions to setup the bot in production (server)

1. Make sure you have followed **all** the steps in [prerequisites](#prerequisites).
2. Clone the repo.
3. Create `logs` folder in the root directory as well as two files inside it:
   1. `restart.txt`
   2. `crash_logs.txt`
4. Install all the packages using: `npm install`.
5. To start the bot, run: `pm2 start bin/doppler-run.sh`. **Make sure to setup [PM2](https://pm2.io/) beforehand**.

## Instructions to self host Supabase

Supabase provides in-depth explanation about self hosting on their [website](https://supabase.com/docs/guides/self-hosting/docker). Below is the summary of what needs to be done with this app:

1. Create an account on [Doppler](https://www.doppler.com/). This is going to be used for storing `.env` secrets (most of them).
2. Create a project in Doppler.
3. Generate JWT_SECRET, ANON_KEY, SERVICE_ROLE_KEY and POSTGRES_PASSWORD using the [generator in Supabase](https://supabase.com/docs/guides/self-hosting#api-keys).
4. Hardcode the ANON_KEY and SERVICE_ROLE_KEY in `volumes/api/kong.yml` (**for now**).
5. Put them in the PROD of your project in Doppler dashboard.
6. Install Doppler CLI by following this [guide/documentation](https://docs.doppler.com/docs/install-cli).
7. Login into your Doppler account from CLI using `doppler login`. Follow the steps on your terminal.
8. Go to `supabase/docker` directory and setup your doppler project locally using `doppler setup`.
9. Install Docker to your server/machine by following this [guide/documentation](https://docs.docker.com/get-docker/) (or [this](https://docs.docker.com/engine/install/) if you are on server).
10.   Setup Doppler project in your local machine by following this [instruction](https://docs.doppler.com/docs/install-cli#project-setup).
11.   Run the following command to spin up Supabase: `doppler run -- docker compose up -d`.
