const {SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('requestroll')
	.setDescription('Request a roll to be made')
    .addStringOption((option) =>
        option
            .setName('roll')
            .setDescription('The roll you wish to execute. (i.e. 2d6)')
            .setRequired(true)
        )
    .addIntegerOption((option) =>
        option
            .setName('rate')
            .setDescription('What number is needed for a proc? Inputted number is not included!')
            .setRequired(true)
            .setMinValue(0)
            )
    .addIntegerOption((option) =>
        option
            .setName('condition')
            .setDescription('What condition do you want to be applied to the rolls, based on the rate.')
            .setRequired(true)
            .addChoices(
                {
                    name: "Higher than X...", value: 0
                },
                {
                    name: "Lower than X...", value: 1
                },
                {
                    name: "Only X...", value: 2
                }
            )
    )   
        .addStringOption((option) =>
        option
            .setName('event')
            .setDescription('Event type, or description of the roll')
    )
        .addBooleanOption((option) =>
        option
            .setName('character')
            .setDescription("Request rollers for a character name? Default: true"))
    ,
    async execute(interaction) {
        const rolling = interaction.options.get('roll').value
        const rollingTemp = rolling.indexOf('d')
        const rollingTemp2 = (rolling.length)


        let amount = rolling.substring(0, rolling.indexOf('d'))
        let integer = rolling.substring(rolling.indexOf('d') + 1, rollingTemp2)
        
        console.log(rolling + " Rolling rate")
        console.log(rollingTemp + " Index of d")
        console.log(rollingTemp2 + " The length of the text")
        console.log(integer + " Integer")
        console.log(amount + " Amount")

        const charc = interaction.options.getBoolean('character') ?? true


        const event = interaction.options.getString('event') ?? `Dice`
        const rate = interaction.options.get('rate').value;
        const condition = interaction.options.get('condition').value;

        console.log(condition + " Condition")

        var conditionID = "";

        // Invalid Input Checks
        if(rate >= (integer*amount) && rollingTemp === -1 && condition === 0) {
            const error = await interaction.reply({ ephemeral: true, content: '**ERROR GRR01:** \n- **RR01** Invalid `[rate]` input! A roll higher than a ' + `**${rate}**, for a **${rolling}** is not possible!` + '\n- **RR07** Invalid `[roll]` input! ' + `**${rolling}** is not a valid input. Correct Format Example: 1d6`})
            return
        } else if(rate < 1 && rollingTemp === -1 && condition === 1) {
            const error = await interaction.reply({ ephemeral: true, content: '**ERROR GRR02:** \n- **RR02** Invalid `[rate]` input! A roll lower than a **1** for any roll is not possible.' + '\n- **RR07** Invalid `[roll]` input! ' + `**${rolling}** is not a valid input. Correct Format Example: 1d6`})
            return
        } else if((rate < 1 || rate >= (integer*amount)) && rollingTemp === -1 && condition === 2) {
            if(rate < 1) {
            const error = await interaction.reply({ ephemeral: true, content: '**ERROR GRR03-2:** \n- **RR02** Invalid `[rate]` input! A roll lower than a **1** for any roll is not possible.' + '\n- **RR07** Invalid `[roll]` input! ' + `**${rolling}** is not a valid input. Correct Format Example: 1d6`})
            return
            } else if(rate >= (integer*amount)) {
                const error = await interaction.reply({ ephemeral: true, content: '**ERROR GRR03-1:** \n- **RR01** Invalid `[rate]` input! A roll higher than a ' + `**${rate}**, for a **${rolling}** is not possible!` + '\n- **RR07** Invalid `[roll]` input! ' + `**${rolling}** is not a valid input. Correct Format Example: 1d6`})
            return    
            }
        } else if(rate >= (integer*amount) && condition === 0) {
            const error = await interaction.reply({ ephemeral: true, content: '**ERROR RR01** Invalid `[rate]` input! A roll higher than a ' + `**${rate}**, for a **${rolling}** is not possible!`})
            return
        } else if(rate < 1) {
            const error = await interaction.reply({ ephemeral: true, content: '**ERROR RR02** Invalid `[rate]` input! A roll lower than a **1** for any roll is not possible.'})
            return
        } else if((rate < 1 || rate >= (integer*amount)) && condition === 2) {
            if(rate < 1) {
            const error = await interaction.reply({ ephemeral: true, content: '**ERROR RR03-2:** Invalid `[rate]` input! A roll lower than a **1** for any roll is not possible.'})
            return
            } else if(rate >= (integer*amount)) {
                const error = await interaction.reply({ ephemeral: true, content: '**ERROR RR03-1:** Invalid `[rate]` input! A roll higher than a ' + `**${rate}**, for a **${rolling}** is not possible!`})
            return    
            }
        } else if(rollingTemp === -1) {
            const error = await interaction.reply({ ephemeral: true, content: '**ERROR RR04:** Invalid `[roll]` input!' + ` **${rolling}** is not a valid input. Correct Format Example: 1d6`})
            return
        }

        if(condition === 0) {
            conditionID = "HIGHER than a "
        } else if (condition === 1) {
            conditionID = "LOWER than a "
        } else if (condition === 2) {
            conditionID = "ONLY "
        }

        const character = new ModalBuilder()
            .setCustomId('character')
            .setTitle('Character Roller')
        
        const characters = new TextInputBuilder()
            .setCustomId('charcinput')
            .setLabel('Who is rolling the dice?')
            .setRequired(true)
            .setPlaceholder('Your character here...')
            .setStyle(TextInputStyle.Short)
        
        const textinput = new ActionRowBuilder().addComponents(characters)
        character.addComponents(textinput)

        const roll = new ButtonBuilder()
            .setCustomId('roll')
            .setLabel(`Roll a ${event} dice`)
            .setStyle(ButtonStyle.Success)

        const end = new ButtonBuilder()
            .setCustomId('end')
            .setLabel('End Rolls')
            .setStyle(ButtonStyle.Secondary)

        const row = new ActionRowBuilder()
            .addComponents(roll, end)

        const rollEnded = new EmbedBuilder()
            .setColor(0x8E44AD)
            .setTitle(`The ${event} Roll has ended!`)

        const rollRequest = new EmbedBuilder()
			.setColor(0x8E44AD)
			.setTitle(`A **__${event}__** roll has been requested...`)
			.setDescription(`Please make your rolls now. \n\n**--------------- Details ---------------**\nNumber of Dices: **${amount}**\nHighest Roll: **${integer}**\nRequirement: **${conditionID}${rate}**\n**---------------------------------------**`)
            .setFooter({
				text: `${interaction.user.globalName}`,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setTimestamp() 

            const response = await interaction.reply({
                embeds: [rollRequest],
                components: [row],
                content: `${interaction.user}`
            })

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button});

        collector.on('collect', async i => {
            const user = i.user.globalName
            const avatar = i.user.displayAvatarURL()

            if(i.customId === 'end') {
                if(interaction.user === i.user) {
                await i.update({embeds: [rollEnded], components:[]})
                } else {
                    await i.reply({content: 'You are not the one who requested the roll!', ephemeral: true})
                }
            }

            if(i.customId === 'roll' && charc === false) {
                const rolls = []
                var rollTotal = 0
                var success = 0
                for(var s = 0; s < amount; s++) {
                    var unique = Math.floor(Math.random() * (integer - 1 + 1)) + 1;
                    rolls.push(` ${unique}`)
                    rollTotal+=unique
                }

                if (condition === 0) {
                    if (rollTotal > rate) {
                        success = 1
                    } else {
                        success = 0
                    }
                }
                if (condition === 1) {
                    if (rollTotal < rate) {
                        success = 1
                    } else {
                        success = 0
                    }
                }
                if (condition === 2) {
                    if (rollTotal === rate) {
                        success = 1
                    } else {
                        success = 0
                    }
                }

                const roll1 = new EmbedBuilder()
                    .setColor(0x6BFF33)
                    .setTitle(`**__${event} Roll Passed__**`)
                    .setDescription(`**🎲 ${user}** rolled a **${rollTotal}** on a **${amount}D${integer}**.🎲 \n\n**Detailed Rolls:** \n ${rolls}` )
                    .setFooter({
                        text: `${user}`,
                        iconURL: avatar,
                    })
                    .setTimestamp()

                const roll2 = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle(`**__${event} Roll Failed__**`)
                    .setDescription(`**🎲 ${user}** rolled a **${rollTotal}** on a **${amount}D${integer}**.🎲 \n\n**Detailed Rolls:** \n ${rolls}` )
                    .setFooter({
                        text: `${user}`,
                        iconURL: avatar,
                    })
                    .setTimestamp()
                
                if (success === 1) {
                    await i.reply({embeds: [roll1]})
                } else if (success === 0) {
                    await i.reply({embeds: [roll2]})
                }       
    }
	        
            if(i.customId === 'roll' && charc === true) {
                
                await i.showModal(character)

                i.awaitModalSubmit({time: 60_000}) 
                    .then((modalInteraction) => {

                        const names = modalInteraction.fields.getTextInputValue('charcinput') ?? ""
                        const rolls = []
                        var rollTotal = 0
                        var success = 0
                        for(var i = 0; i < amount; i++) {
                            var unique = Math.floor(Math.random() * (integer - 1 + 1)) + 1;
                            rolls.push(` ${unique}`)
                            rollTotal+=unique
                        }

                        if (condition === 0) {
                            if (rollTotal > rate) {
                                success = 1
                            } else {
                                success = 0
                            }
                        }
                        if (condition === 1) {
                            if (rollTotal < rate) {
                                success = 1
                            } else {
                                success = 0
                            }
                        }
                        if (condition === 2) {
                            if (rollTotal === rate) {
                                success = 1
                            } else {
                                success = 0
                            }
                        }

                        const roll1 = new EmbedBuilder()
        			        .setColor(0x6BFF33)
        			        .setTitle(`**__${event} Roll Passed__** - Rolled by: ${names}`)
        			        .setDescription(`**🎲 ${names}** rolled a **${rollTotal}** on a **${amount}D${integer}**.🎲 \n\n**Detailed Rolls:** \n ${rolls}` )
					        .setFooter({
						        text: `${user}`,
						        iconURL: avatar,
				            })
        			        .setTimestamp()

                        const roll2 = new EmbedBuilder()
        			        .setColor(0xFF0000)
        			        .setTitle(`**__${event} Roll Failed__** - Rolled by: ${names}`)
        			        .setDescription(`**🎲 ${names}** rolled a **${rollTotal}** on a **${amount}D${integer}**.🎲 \n\n**Detailed Rolls:** \n ${rolls}` )
					        .setFooter({
						        text: `${user}`,
						        iconURL: avatar,
				            })
        			        .setTimestamp()
                        
                        if (success === 1) {
                            modalInteraction.reply({embeds: [roll1]})
                        } else if (success === 0) {
                            modalInteraction.reply({embeds: [roll2]})
                        }
                    })
                    .catch(err => console.log(err))
            }
        }
        )
    }
}