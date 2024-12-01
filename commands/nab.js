const { SlashCommandBuilder } = require("discord.js");
const User = require('../models/User')
function capitalize(sentence) {
    return sentence.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
module.exports = {
    data: new SlashCommandBuilder()
    .setName('nab')
    .setDescription('Allows users to pick their nen ability'),
    async execute(message, args){
        const pick = args[0]
        const abilities = ['emitter', 'transmuter', 'enhancer', 'manipulator','conjurer']
        if(!pick || !abilities.includes(pick.toLowerCase())){
            return message.channel.send(`Please pick one of the following: \`Use as '>nab {${abilities.join()}}'\``)
        }
        let user = await User.findOne({userId:message.author.id})
        if(!user){
            user = new User({
                userId: message.author.id,
                name:message.author.globalName
            })
           await user.save();
        }
        user.ability = capitalize(pick);
        await user.save();
        return message.channel.send(`Congrats! Your Nen ability has been set to ${capitalize(pick)}`);
    }
}