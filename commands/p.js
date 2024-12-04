const { SlashCommandBuilder } = require("discord.js");
const User = require('../models/User');
const { EmbedBuilder } = require("@discordjs/builders");
module.exports = {
    data : new SlashCommandBuilder()
    .setName('p')
    .setDescription("To view the user's nen hunter lisence"),
    async execute(message, args){
        if(args[0]&& args[0].includes('@')){
            const mentionRegex = /<@!?(\d+)>/;
    
    // Match the regex against the message content
            const match = args[0].match(mentionRegex);
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
            pers = message.author;
        }
        
        let user = await User.findOne({userId:pers.id})
        if(!user){
            user = new User({
                userId: pers.id,
                name:pers.globalName
            })
            await user.save();
        }
        const inv = user.inventory.length;
        const embed = new EmbedBuilder()
        .setTitle(`${pers.globalName}'s Profile`)
        .setThumbnail(pers.displayAvatarURL())
        .setDescription(`This is the information on <@${pers.id}>`)
        .addFields(
            {name:'Nen', value: `**${user.balance}**`, inline:true},
            {name:'Nen Ability', value: `**${user.ability? user.ability : "*No Nen ability selected yet*"}**`, inline:true},
            {name:"# in Inventory",value: `*${inv ? user.inventory.length + ' items' :"No items in inventory"}*`, inline:true},
            {name: 'Discipline', value:`${user.discipline[1]}`,inline:true}

        )
        .setColor(0x9c3668)
        .setTimestamp()
        .setFooter({text:"Meruem"});
        return message.channel.send({embeds:[embed]});
    }
}