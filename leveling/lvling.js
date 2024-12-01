const { EmbedBuilder } = require('discord.js');
async function giveRole(message,name){
    const role = await message.guild.roles.cache.find(r => r.name === name)
    const mem = await message.guild.members.cache.find(m => m.id === message.author.id)
    if(role && !mem.roles.cache.has(role)){
        mem.roles.add(role)
    }
}
module.exports = (async(user,message)=>{
    let mult = 1;
    if(user.level >=5){
        giveRole(message,'5-Civillian')
    }
    if(user.level >=15){
        giveRole(message, '15-Hunter')
        mult = 2;
    } else if(user.level >=25){
        giveRole(message,'25-1 Star Hunter')
        mult = 3
    } else if(user.level >= 35){
        giveRole(message,'35-2 Star Hunter')
        mult = 4;
    } else if(user.level >=55){
        giveRole(message,'55-3 Star Hunter')
        mult = 5;
    } else if(user.level >= 75){
        giveRole(message,'75-Troupe Member')
        mult = 6;
    } else if(user.level >= 100){
        giveRole('100-Zoldyck')
        mult = 7;
    } else if(user.level >= 150){
        giveRole(message,'150-King')
        mult = 8;
    }
    user.xp +=1 * mult;
    user.msgs+=1;
    if(user.xp >= user.goal){
        user.level +=1;
        const embed = new EmbedBuilder()
        .setTitle('New Level Up!')
        .setDescription(`<@${user.userId}> You have now reached level ${user.level}`)
        .setThumbnail('https://media.discordapp.net/attachments/1309351299191410748/1311783223415799920/35D622D4-FE4D-4150-9EE2-F91E6D18C899.gif?ex=674a1cd4&is=6748cb54&hm=1a71ae12818bb5562d3f273f5feb6a27922906b5ef1108cdf3897d1e62c6cb33&=')
        .setFooter({text:'Meruem',iconURL:message.author.displayAvatarURL()});
        await message.reply({embeds:[embed]});
        user.goal = Math.floor((user.goal * 1.5));
    }
    await user.save()
    return;
});