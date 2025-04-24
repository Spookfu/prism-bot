const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('notice')
    .setDescription('Create a notice')
        .addStringOption((option) => 
            option
                .setName("color")
                .setDescription("Input a hexadecimal")
        )
        .addStringOption((option) => 
            option
                .setName("title")
                .setDescription("Title of the Embed")
        )
        .addStringOption((option) => 
            option
                .setName("text")
                .setDescription("The text you want")
        )
        .addStringOption((option) => 
            option
                .setName("footer")
                .setDescription("The bottom text")
        )
        ,
        async execute(interaction) {
            var color = (interaction.options.getString("color")) ?? `000000 `
            color = '0x' + color
            const title = interaction.options.getString("title") ?? ` `
            const text = interaction.options.getString("text") ?? ` `
            const footer = interaction.options.getString("footer") ?? ` ` 
            const notice = new EmbedBuilder()
            console.log(color)
            notice.setColor(Number(color))
            notice.setTitle(title)
            notice.setDescription(text)
            notice.setFooter({
                text: `${footer} - ${interaction.user.globalName}`,
				iconURL: interaction.user.displayAvatarURL(),
            })

            const response = await interaction.reply({
                embeds: [notice],
            })
    }
}