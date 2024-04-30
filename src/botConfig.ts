import { ColorResolvable } from 'discord.js';

const BOT_CONFIGS = {
	color: {
		default: '#3A9CE2' as ColorResolvable,
		red: '#D83C3E' as ColorResolvable,
		green: '#3BA55C' as ColorResolvable,
		orange: '#FFA500' as ColorResolvable,
		blue: '#0796e5' as ColorResolvable,
	},
	spamTimeoutDuration: 15,
	DOT: ' • ',
};

export default BOT_CONFIGS;
