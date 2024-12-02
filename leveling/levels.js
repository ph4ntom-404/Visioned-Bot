const lvling = require('./lvling.js')
const Users = require('../models/levels.js')
module.exports = async (user,message) => {
    try {
        let usr = await Users.findOne({userId:user.id})
        if(!usr){
            usr = new Users({
                userId: user.id,
                name:user.globalName || user.username
            })
            await usr.save();
            return;
        }else{
            lvling(usr,message);
        }

        
    } catch (error) {
        console.error('Error reading the file:', error);
        return false;
    }
};