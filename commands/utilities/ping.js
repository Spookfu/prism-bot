const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Pings the bot. '),
	async execute(interaction) {
		const sent = await interaction.reply({ ephemeral: true, content: 'Pinging...', fetchReply: true });
	interaction.editReply({ content: `Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`, ephemeral: true});
	console.log("Bot Pinged!");
	},
};