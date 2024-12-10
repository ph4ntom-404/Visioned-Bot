const { SlashCommandBuilder } = require("discord.js");
const cooldowns = require('../models/cooldowns')
const Users = require('../models/User')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('allows users to collect a daily reward'),
    async execute(message, args){
        const person = message.author;
        let user = await cooldowns.findOne({userId:person.id})
        if(!user){
            user = new cooldowns({userId: person.id})
            await user.save();
        }
        let pers = await Users.findOne({userId: person.id})
        if(!pers){
            pers = new Users({
                userId: person.id,
                name: person.globalName || person.username
            })
            await pers.save();
        }
        const cooldown = 12 * 60 * 60 * 1000;
        const now = Date.now();
        const lsu = user.lastUsed ? new Date(user.lastUsed).getTime() : 0
        const timeLeft = cooldown - (now - lsu);
        if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            return message.reply(`You can use this command again in \`${hours} hours and ${minutes} minutes.\``);
        }
        user.lastUsed = new Date()
        let mult;
        if(user.streak >= 1){
            mult = 0.2
        }else{
            mult = 0;
        }
        const daily =  400 + ((user.streak * mult) * 100);
        pers.balance += daily
        user.streak+=1;
        await user.save();
        await pers.save();
        return message.channel.send(`You have collected your daily reward of ***${daily} Nen***!\nYou have a \`${user.streak}\` day streak.\nCome back in \`11 hours and 59 minutes\``)
    }
}