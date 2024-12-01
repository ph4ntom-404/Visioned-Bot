const { SlashCommandBuilder } = require("discord.js");
const User = require('../models/User')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('give')
    .setDescription('to give a user some of your nen!'),
    async execute(message, args){
        if(args[1]&& args[1].includes('@')){
            const mentionRegex = /<@!?(\d+)>/;
    
    // Match the regex against the message content
            const match = args[1].match(mentionRegex);
            const mem = await message.guild.members.cache.find(m=>m.id === match[1])
            if (!mem){
                message.reply("That is not a valid member!")
                return;
            }else{
                pers = mem.user;
                if(pers.bot){
                    return message.channel.send("This person doesn't have a profile")
                }
            }
        }else{
            return message.channel.send("You did not specify someone to give money to. `>give {amount} {user}`")
        }
        if(pers.id === message.author.id){
            return message.channel.send("You can't transfer Nen to yourself!")
        }
        let user = await User.findOne({userId:message.author.id})
        if(!user){
            user = new User({
                userId: message.author.id,
                name: message.author.globalName
            })
            await user.save();
        }
        const amt = args[0];
        if(!amt || isNaN(parseInt(amt))){
            return message.channel.send("You didn't input a valid amount of Nen!")
        }
        if(user.balance < parseInt(amt)){
            return message.channel.send("You cannot give someone more Nen than you possess")
        }
        user.balance -= parseInt(amt)
        await user.save();
        let rect = await User.findOne({userId: pers.id})
        if(!rect){
            rect = new User({
                userId: pers.id,
                name: pers.globalName
            })
            await rect.save();
        }
        rect.balance += parseInt(amt);
        await rect.save();
        return message.channel.send(`Successfully transferred ${amt} Nen to ${pers.globalName}`)
    }
}