const { SlashCommandBuilder } = require("discord.js");
const User = require('../models/User')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('bal')
    .setDescription('To check the nen balance of the user'),
    async execute(message, args){
        const userId = message.author.id;
        let user = await User.findOne({userId});
        if(!user){
            user = new User({
                userId:userId,
                name:message.author.globalName
            })
            await user.save();
        }
        return message.channel.send(`You currently have **${user.balance} Nen**!`)
    }
};