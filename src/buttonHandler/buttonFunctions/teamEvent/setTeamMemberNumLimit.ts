import fs from 'fs';

import {
	Client,
	ButtonInteraction,
	MessageEmbed,
	Modal,
	TextInputComponent,
	MessageActionRow,
	ModalActionRowComponent,
} from 'discord.js';

import { ButtonFunction } from '../../ButtonStructure';

const setTeamMemberNumLimit: ButtonFunction = {
	customId: 'setTeamNumLimit',
	run: async (client: Client, interaction: ButtonInteraction) => {},
};

export default setTeamMemberNumLimit;
