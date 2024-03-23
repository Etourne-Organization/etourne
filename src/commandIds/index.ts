const commandIds = {
	HELP:
		process.env.MODE === 'DEV'
			? '1044182617563602957'
			: '1037285868903342170',
	CREATE_EVENT:
		process.env.MODE === 'DEV'
			? '1161725057022820412'
			: '1165247740314390560',
	CREATE_TEAM_EVENT:
		process.env.MODE === 'DEV'
			? '1171025427066785893'
			: '1171030255289516115',
	BOT_INFO:
		process.env.MODE === 'DEV'
			? '1169537106511675423'
			: '1170814109734936700',
	SET_USER_ROLE:
		process.env.MODE === 'DEV'
			? '1170284991792554069'
			: '1170284991792554069',
	GET_STARTED:
		process.env.MODE === 'DEV'
			? '1170284991792554069'
			: '1170284991792554069',
	LIST_SERVER_EVENTS:
		process.env.MODE === 'DEV'
			? '1170284991792554069'
			: '1170284991792554069',
	GET_EVENT:
		process.env.MODE === 'DEV'
			? '1170284991792554069'
			: '1170284991792554069',
	FEEDBACK:
		process.env.MODE === 'DEV'
			? '1170284991792554069'
			: '1170284991792554069',
	REGISTER_SERVER:
		process.env.MODE === 'DEV'
			? '1170284991792554069'
			: '1170284991792554069',
	REQUEST_SUPPORT:
		process.env.MODE === 'DEV'
			? '1170284991792554069'
			: '1170284991792554069',
	REGISTER_ADMIN:
		process.env.MODE === 'DEV'
			? '1170284991792554069'
			: '1170284991792554069',
};

export default commandIds;
