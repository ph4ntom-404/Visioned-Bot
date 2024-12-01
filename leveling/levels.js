const fs = require('fs').promises;
const lvling = require('./lvling.js')
module.exports = async (user,message) => {
    try {
        const data = await fs.readFile('./leveling/users.json', 'utf8');
        const users = JSON.parse(data);

        if (!users.hasOwnProperty(user.id)) {
            users[user.id] = { 
                name: user.globalName,
                level:0,
                xp:0,
                msgs:1,
                goal:50
             };

            // Write the updated data back to the file
            await fs.writeFile('./leveling/users.json', JSON.stringify(users, null, 2));
            return;
        } else {
            lvling(user,message);
        }
    } catch (error) {
        console.error('Error reading the file:', error);
        return false;
    }
};