const { SlashCommandBuilder } = require("discord.js");
const Users = require('../models/User')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('disciple')
    .setDescription("Pick which creator you want to be a disciple of"),
    async execute(message,args){
        const masters = ["blixkey", 'phantom','ram','sasuqe','lurk','garlic','fusagari','winter']
        const pick = args[0];
        const roleNames = ["Blixkey's Disciple", "Phantom's Disciple", "Ram's Disciple", "Sasuqe's Disciple", "Lurk's Disciple", "Garlic's Disciple", "Fusagari's Disciple", "Winter's Disciple"]
        if(!args[0] || !masters.includes(pick.toLowerCase())){
            return message.channel.send(`You didn't pick a master to be a disciple of! Use:\n\`>disciple {${masters.join(', ')}}\``)
        }
        let user = await Users.findOne({userId:message.author.id})
        if(!user){
            user = new Users({
                userId: message.author.id,
                name: message.author.globalName || message.author.username
            })
            await user.save();
        }
        let gr = roleNames.find(r=> r.toLowerCase().startsWith(pick.toLowerCase()));
        const role = message.guild.roles.cache.find(r => r.name === gr)
        if(!role){
            return message.channel.send("I couldn't find the role to give you!")
        }
        const mem = await message.guild.members.cache.get(message.author.id);
        if(user.discipline && user.discipline.length > 0){
            await mem.roles.remove(user.discipline[0])
            await mem.roles.add(role.id)
            user.discipline = [role.id, gr]
            await user.save();
            return message.channel.send(`You have chosen to be ${gr}`)
        }else{
            await mem.roles.add(role.id)
            user.discipline = [role.id, gr]
            await user.save();
            return message.channel.send(`You have chosen to be ${gr}`)
        }
    }
}