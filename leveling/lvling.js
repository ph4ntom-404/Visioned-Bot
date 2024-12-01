const { EmbedBuilder } = require('discord.js');

const fs = require('fs').promises;

module.exports = (async(user,message)=>{
    const data = await fs.readFile('./leveling/users.json', 'utf8');
    const users = JSON.parse(data);
    users[user.id].msgs +=1;
    if(users[user.id].msgs >= users[user.id].goal){
        users[user.id].level +=1;
        const embed = new EmbedBuilder()
        .setTitle('New Level Up!')
        .setDescription(`<@${user.id}> You have now reached level ${users[user.id].level}`)
        .setThumbnail('https://media.discordapp.net/attachments/1309351299191410748/1311783223415799920/35D622D4-FE4D-4150-9EE2-F91E6D18C899.gif?ex=674a1cd4&is=6748cb54&hm=1a71ae12818bb5562d3f273f5feb6a27922906b5ef1108cdf3897d1e62c6cb33&=')
        .setFooter({text:'Meruem',iconURL:message.author.displayAvatarURL()});
        await message.reply({embeds:[embed]});
        users[user.id].goal = Math.floor((users[user.id].goal * 1.5)/10) * 10;
    }
    users[user.id].xp = (users[user.id].msgs/users[user.id].goal)*100
    await fs.writeFile('./leveling/users.json', JSON.stringify(users,null,2));
    return;
});