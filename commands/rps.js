const { SlashCommandBuilder } = require("discord.js");
const User = require('../models/User')
module.exports = {
    data : new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Plays a quick game of rock paper scissors'),
    async execute(message, args){
        const choices = ["rock", "paper", 'scissors']
        const pick = choices[Math.floor(Math.random()*choices.length)]
        if(!args[0]||!choices.includes(args[0].toLowerCase())){
            return message.channel.send("Please choose either `Rock, Paper, or Scissors`")
        }
        const player = args[0].toLowerCase()
        let user = await User.findOne({
            userId: message.author.id
        })
        if(!user){
            user = new User({
                userId: message.author.id,
                name: message.author.globalName
            })
            await user.save();
        }
        if(user.balance <= 0){
            return message.channel.send('You are in Nen debt right now, play another game in order to acquire more Nen!')
        }
        if(pick === args[0]){
            return message.channel.send(`**Draw!** You chose **${args[0]}**, but I also chose **${pick}**!`)
        } else if(pick === 'paper' && player === 'rock'){
            user.balance -= 5;
            user.save();
            return message.channel.send(`**You lose**! You chose **${player}**, but I chose **${pick}**!\n\`You lost 5 Nen\``)
        } else if(pick === 'scissors' && player === 'paper'){
            user.balance -=5;
            await user.save();
            return message.channel.send(`**You lose**! You chose **${player}**, but I chose **${pick}**!\n\`You lost 5 Nen\``)
        } else if (pick === 'rock' && player === 'scissors'){
            user.balance -=5;
            await user.save();
            return message.channel.send(`**You lose**! You chose **${player}**, but I chose **${pick}**!\n\`You lost 5 Nen\``)
        }else{
            user.balance+=20;
            await user.save();
            return message.channel.send(`**You win**! You chose **${player}**, but I chose **${pick}**!\n\`You gained 20 Nen\``)
        }
    }
}