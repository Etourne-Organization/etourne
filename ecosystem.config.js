module.exports = {
	apps: [
		{
			name: 'Etourne',
			script: './prod/bot.js',
		},
	],

	// Deployment Configuration
	deploy: {
		production: {
			user: 'ubuntu',
			host: ['192.168.0.13', '192.168.0.14', '192.168.0.15'],
			ref: 'origin/master',
			repo: 'git@github.com:Muntasir2001/etourne.git',
			path: '/var/www/etourne',
			'post-deploy': 'npm install',
		},
	},
};
