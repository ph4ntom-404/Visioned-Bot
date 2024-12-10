const Users = require('../models/User')
const levels = require('../models/levels')
module.exports = {
    name:'exp',
    run: async (message, shop)=>{
        const person = message.author;
        const itm = shop.Utility.Exp;
        let user = await Users.findOne({userId:person.id})
        if(!user){
            user = new Users({
                userId: person.id,
                name: person.globalName || person.username
            })
            user.save();
        }
        let lvls = await levels.findOne({userId:person.id})
        if(!lvls){
            lvls = new levels({
                userId:person.id,
                name:person.globalName || person.username
            })
            lvls.save();
        }
        if(user.balance < itm.price){
            return message.channel.send("You do not have enough Nen to make this purchase!")
        }
        user.balance -= itm.price;
        lvls.xp += 50;
        lvls.save();
        user.save();
        return message.channel.send("You have successfully purchased 500xp!")
    }
}