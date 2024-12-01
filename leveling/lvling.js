const { EmbedBuilder } = require('discord.js');

module.exports = (async(user,message)=>{
    let mult = 1;
    if(user.level >=15){
        mult = 2;
    } else if(user.level >=25){
        mult = 3
    } else if(user.level >= 35){
        mult = 4;
    } else if(user.level >=55){
        mult = 5;
    } else if(user.level >= 75){
        mult = 6;
    } else if(user.level >= 100){
        mult = 7;
    } else if(user.level >= 150){
        mult = 8;
    }
    user.xp +=2 * mult;
    user.msgs+=1;
    if(user.xp >= user.goal){
        user.level +=1;
        const embed = new EmbedBuilder()
        .setTitle('New Level Up!')
        .setDescription(`<@${user.userId}> You have now reached level ${user.level}`)
        .setThumbnail('https://media.discordapp.net/attachments/1309351299191410748/1311783223415799920/35D622D4-FE4D-4150-9EE2-F91E6D18C899.gif?ex=674a1cd4&is=6748cb54&hm=1a71ae12818bb5562d3f273f5feb6a27922906b5ef1108cdf3897d1e62c6cb33&=')
        .setFooter({text:'Meruem',iconURL:message.author.displayAvatarURL()});
        await message.reply({embeds:[embed]});
        user.goal = Math.floor((user.goal * 1.5)/10) * 10;
    }
    await user.save()
    return;
});