import fs from 'fs';

import {
	BaseCommandInteraction,
	Client,
	Constants,
	MessageEmbed,
	MessageSelectMenu,
	MessageAttachment,
	MessageActionRow,
	MessageButton,
	Modal,
	TextInputComponent,
	ModalActionRowComponent,
	Message,
} from 'discord.js';
import momentTimzone from 'moment-timezone';

import { Command } from '../../CommandStructure';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';
import teamEventInfoData from '../../../data/teamEventInfo';

const createTeamEvent: Command = {
	name: 'createteamevent',
	description: 'Create team event',
	type: 'CHAT_INPUT',
	options: [
		{
			name: 'numteamlimit',
			description: 'Num of team. Defaults to unlimited',
			type: Constants.ApplicationCommandOptionTypes.INTEGER,
			required: false,
		},
		{
			name: 'numteammemberlimit',
			description: 'Num of team member. Defaults to unlimited',
			type: Constants.ApplicationCommandOptionTypes.INTEGER,
			required: false,
		},
	],
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			const createTeamBtnId: string = `createTeamBtn-${interaction.id}`;

			let numTeamLimit: number | any =
				interaction.options.get('numteamlimit');
			let numTeamMemberLimit: number | any =
				interaction.options.get('numteammemberlimit');

			// set numTeamLimit and numTeamMemberLimit in a TS file temporarily
			teamEventInfoData.numTeamLimit = numTeamLimit
				? numTeamLimit.value
				: null;
			teamEventInfoData.numTeamMemberLimit = numTeamMemberLimit
				? numTeamMemberLimit.value
				: null;

			/* modal */
			const modal = new Modal()
				.setCustomId(`eventModalSubmit-${interaction.id}`)
				.setTitle('Create Team Event');

			const eventNameInput = new TextInputComponent()
				.setCustomId('eventName')
				.setLabel('Event name')
				.setStyle('SHORT')
				.setPlaceholder('Event name');

			const gameNameInput = new TextInputComponent()
				.setCustomId('gameName')
				.setLabel('Game name')
				.setStyle('SHORT')
				.setPlaceholder('Game name');

			const eventDateTimeInput = new TextInputComponent()
				.setCustomId('date')
				.setLabel('Date (format: DD/MM/YYYY hour:minute)')
				.setStyle('SHORT')
				.setPlaceholder('Event date');

			const eventTimezoneInput = new TextInputComponent()
				.setCustomId('timezone')
				.setLabel('Your timezone: timezones.etourne.xyz')
				.setStyle('SHORT')
				.setPlaceholder('Your timezone');

			const eventDescriptionInput = new TextInputComponent()
				.setCustomId('eventDescription')
				.setLabel('Event description')
				.setStyle('PARAGRAPH')
				.setPlaceholder('Event description');

			const eventNameActionRow =
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					eventNameInput,
				);

			const gameNameActionRow =
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					gameNameInput,
				);

			const eventTimezoneActionRow =
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					eventTimezoneInput,
				);

			const eventDateTimeActionRow =
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					eventDateTimeInput,
				);

			const eventDescriptionActionRow =
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					eventDescriptionInput,
				);

			modal.addComponents(
				eventNameActionRow,
				gameNameActionRow,
				eventTimezoneActionRow,
				eventDateTimeActionRow,
				eventDescriptionActionRow,
			);

			await interaction.showModal(modal);

			client.on('interactionCreate', async (i) => {
				if (i.isButton()) {
					if (i.customId.includes('register')) {
						console.log(`register: ${i.customId}`);
						i.reply({ content: `register: ${createTeamBtnId}` });
					}

					if (i.customId.includes('unregister')) {
						console.log(`unregister: ${i.customId}`);
						i.reply({ content: `unregister: ${createTeamBtnId}` });
					}
				}
			});
		} catch (err) {
			interaction.reply({
				embeds: [infoMessageEmbed(':x: There has been an error', 'ERROR')],
			});

			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in slashcommands/createTeamEvent/createTeamEvent.ts \n Actual error: ${err} \n \n`,
					(err) => {
						if (err) throw err;
					},
				);
			} catch (err) {
				console.log('Error logging failed');
			}
		}
	},
};

export default createTeamEvent;
