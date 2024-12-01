const { SlashCommandBuilder, EmbedBuilder} = require("discord.js")
const Users = require('../models/levels')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('lvl')
    .setDescription('To check a users level info'),
   async execute(message, args) {
    let pers;
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
                return message.channel.send("This person doesn't have a level")
            }
        }
    }else{
        pers = message.author;
    }

    let user = await Users.findOne({userId:pers.id})
    if(!user){
        user = new Users({
            userId:pers.id,
            name:pers.globalName
        })
        await user.save()
    }
    const embed = new EmbedBuilder()
    embed.setColor(0x044d11)
    .setTitle(`${pers.globalName}'s info`)
    .setThumbnail(pers.displayAvatarURL({dynamic:true}))
    .setDescription(`The level information for ${pers.globalName}`)
    .addFields(
        {name:'Level', value:`${user.level}`},
        {name:'XP', value:`${user.xp * 10}xp / ${user.goal * 10}xp`},
        {name:'%', value:`${Math.round((user.xp / user.goal)) * 100}%`},
        {name:"Messages Sent", value:`${user.msgs}`}
    )
    .setTimestamp()
    .setFooter({text:'Treasures Bot'});
    message.channel.send({embeds:[embed]})
  }
}