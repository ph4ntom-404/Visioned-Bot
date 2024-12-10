const Users = require('../models/User')
module.exports = {
    name:'role-handler',
    run : async (message, shop, role)=>{
        const server = message.guild;
        const person = message.author;
        const drol = server.roles.cache.find(r => r.name === role)
        if(!drol){
            return message.channel.send(`I can't find the **${role}** role to give you!`)
        }
        let user = await Users.findOne({userId:person.id})
        if(!user){
            user = new Users({
                userId: person.id,
                name: person.globalName || person.username
            })
            await user.save();
            return message.channel.send("You do not have enough nen to make this purchase!")
        }
        const purchase = shop.Roles[role]
        if(user.inventory.includes(role) && role !== 'Custom Role'){
            return message.channel.send(`You have already purchased the ${role} role!`)
        }

        if(user.balance < purchase.price){
            return message.channel.send("You do not have enough nen to make this purchase!")
        }
        user.balance -= purchase.price;
        user.inventory.push(role);
        await user.save();
        const guildMem = await message.guild.members.cache.find(m => m.id == person.id)
        if(role === 'Custom Role'){
            return message.channel.send("You have successfully purchased a ***Custom Role***, DM `Aura Phantom` in order to configure it's details!")
        }else{
            try{
                guildMem.roles.add(drol.id)
                }catch(err){
                    return message.channel.send(`An error occured trying to give you the ***${role}*** role!`)
                }
            return message.channel.send(`You have sucessfully purchased the ***${role}*** role`)
        }
    }
}