const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('roll')
	.setDescription('Roll a Dice of your choosing.')
	.addStringOption((option) =>
		option
			.setName('roll')
			.setDescription('The roll you wish to execute. (i.e. 2d6)')
			.setRequired(true)
		)
    .addStringOption((option) =>
        option
            .setName('character')
            .setDescription('The name of the character rolling')
        )
		.addStringOption((option) =>
			option
				.setName('event')
				.setDescription('Event type')
		)
	
   
	,
    async execute(interaction) {
        const rolling = interaction.options.get('roll').value
        const rollingTemp = rolling.indexOf('d')
        const rollingTemp2 = (rolling.length)


        let amount = rolling.substring(0, rolling.indexOf('d'))
        let integer = rolling.substring(rolling.indexOf('d') + 1, rollingTemp2)

        if(rollingTemp === -1) {
            const error = await interaction.reply({ ephemeral: true, content: '**ERROR R01:** Invalid `[roll]` input!' + ` **${rolling}** is not a valid input. Correct Format Example: 1d6`})
            return
        }
        console.log(rolling + " Rolling rate")
        console.log(rollingTemp + " Index of d")
        console.log(rollingTemp2 + " The length of the text")
        console.log(integer + " Integer")
        console.log(amount + " Amount")
		
		let type = interaction.options.getString('event') ?? "NE";
		console.log(type)

		const rolls = []
		var rollTotal = 0
		for(var i = 0; i < amount; i++) {
			var unique = Math.floor(Math.random() * (integer - 1 + 1)) + 1;
			rolls.push(` ${unique}`)
			rollTotal+=unique
		}
                let character = interaction.options.getString('character') ?? `NC`;
				console.log(character)
				
				// ROLLING
        		const resultALL = new EmbedBuilder()
        			.setColor(0x3498DB)
        			.setTitle(`**__${type} Roll__** - Rolled by: ${character}`)
        			.setDescription(`**🎲 ${character}** rolled a **${rollTotal}** on a **${amount}D${integer}**.🎲 \n\n**Detailed Rolls:** \n ${rolls}` )
					.setTimestamp()
					.setFooter({
						text: `${interaction.user.globalName}`,
						iconURL: interaction.user.displayAvatarURL(),
				})

				const resultNC = new EmbedBuilder()
					.setColor(0x3498DB)
					.setTitle(`**__${type} Roll__**`)
					.setDescription(`**🎲 ${interaction.user.globalName}** rolled a **${rollTotal}** on a **${amount}D${integer}**.🎲 \n\n**Detailed Rolls:** \n ${rolls}` )
					.setTimestamp()
					.setFooter({
						text: `${interaction.user.globalName}`,
						iconURL: interaction.user.displayAvatarURL(),
				})
				const resultNE = new EmbedBuilder()
					.setColor(0x3498DB)
					.setTitle(`**__Dice Roll__** - Rolled by: ${character}`)
					.setDescription(`**🎲 ${character}** rolled a **${rollTotal}** on a **${amount}D${integer}**.🎲 \n\n**Detailed Rolls:** \n ${rolls}` )
					.setTimestamp()
					.setFooter({
						text: `${interaction.user.globalName}`,
						iconURL: interaction.user.displayAvatarURL(),
				})
				const resultN = new EmbedBuilder()
					.setColor(0x3498DB)
					.setTitle(`**__Dice Roll__**`)
					.setDescription(`**🎲 ${interaction.user.globalName}** rolled a **${rollTotal}** on a **${amount}D${integer}**.🎲 \n\n**Detailed Rolls:** \n ${rolls}` )
					.setTimestamp()
					.setFooter({
						text: `${interaction.user.globalName}`,
						iconURL: interaction.user.displayAvatarURL(),
					
				})

					if(character != "NC" && type != "NE") {
        			await interaction.reply({embeds: [resultALL]})
        			return
					} else if (character != "NC" && type === "NE") {
						await interaction.reply({embeds: [resultNE]})
						return
					} else if (character === "NC" && type != "NE") {
						await interaction.reply({embeds: [resultNC]})
						return
					} else if (character === "NC" && type === "NE") {
						await interaction.reply({embeds: [resultN]})
						return
					}
			}
        }