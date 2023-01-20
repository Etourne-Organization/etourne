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
import createTeamInteractionCreate from './createTeamInteractionCreate';

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
			const modalId: string = `myModal-${interaction.id}`;
			const createTeamBtnId: string = `createTeamBtn-${interaction.id}`;

			let message: Message | any;

			let eventName: string | any;
			let gameName: string | any;
			let timezone: string | any;
			let eventDateTime: string | any;
			let numTeamLimit: number | any =
				interaction.options.get('numteamlimit');
			let numTeamMemberLimit: number | any =
				interaction.options.get('numteammemberlimit');
			let description: string | any;

			let registeredPlayerNamesList: string[] = [];
			let registeredPlayerNames: string = '>>>  ';
			let eventEmbed = new MessageEmbed();

			/* modal */
			const modal = new Modal()
				.setCustomId(modalId)
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

			/* buttons */
			const buttons = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId(createTeamBtnId)
					.setLabel('Create Team')
					.setStyle('PRIMARY'),
			);

			await interaction.showModal(modal);

			client.on('interactionCreate', async (i) => {
				const teamModalId = `createTeam-${i.id}`;

				if (i.isModalSubmit() && i.customId === modalId) {
					eventName = i.fields.getTextInputValue('eventName');
					gameName = i.fields.getTextInputValue('gameName');
					timezone = i.fields.getTextInputValue('timezone');
					eventDateTime = i.fields.getTextInputValue('date');
					description = i.fields.getTextInputValue('eventDescription');

					eventEmbed
						.setColor('#3a9ce2')
						.setTitle(eventName)
						.setDescription(
							`**----------------------------------------** \n **Event description:** \n \n >>> ${description}  \n \n`,
						)
						.addField(
							'Event date & time',
							`<t:${momentTimzone
								.tz(eventDateTime, 'DD/MM/YYYY hh:mm', timezone)
								.unix()}:F>`,
							true,
						)
						.addField('Game name', gameName, true)
						.addField(
							'Num of team limit',
							numTeamLimit ? `${numTeamLimit.value}` : 'Unlimited',
						)
						.addField(
							'Num of team member limit',
							numTeamMemberLimit
								? `${numTeamMemberLimit.value}`
								: 'Unlimited',
						)
						.addField('Hosted by', `${interaction.user.tag}`);

					if (!i.inCachedGuild()) return;

					message = await i.channel?.send({
						embeds: [eventEmbed],
						components: [buttons],
					});

					i.reply({
						embeds: [
							infoMessageEmbed(
								':white_check_mark: Team Event Created Successfully',
							),
						],
						ephemeral: true,
					});
				}

				if (i.isButton()) {
					if (i.customId === createTeamBtnId) {
						const teamFormModal = new Modal()
							.setCustomId(teamModalId)
							.setTitle('Create Team');

						const teamNameInput = new TextInputComponent()
							.setCustomId('teamName')
							.setLabel('Team Name')
							.setStyle('SHORT')
							.setPlaceholder('Team name');

						const teamNameActionRow =
							new MessageActionRow<ModalActionRowComponent>().addComponents(
								teamNameInput,
							);

						teamFormModal.addComponents(teamNameActionRow);

						await i.showModal(teamFormModal);

						createTeamInteractionCreate(client, teamModalId);
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
