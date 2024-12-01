const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder} = require("discord.js")
const fs = require('fs').promises;

async function rankUsers(users){
     // Convert the JSON object into an array of entries: [id, userData]
     const userEntries = Object.entries(users);

     // Sort users by their `xp` property in descending order
     const sortedUsers = userEntries.sort(([, a], [, b]) => b.msgs - a.msgs);
 
     // Map the sorted users to include only the rank and id
     const rankedList = sortedUsers.map(([id], index) => ({
         rank: index + 1, // Rank starts at 1
         id               // User ID
     }));
 
     return rankedList;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lb')
    .setDescription("To check the level rank of members in the server"),
  async execute(message, args) {
    let pers;
    if(args[0]){
        const mem = await message.guild.members.cache.get(args[0]);
        if (!mem){
            message.reply("That is not a valid member!")
        }else{
            pers = mem;
        }
    }else{
        pers = message.author;
    }

    const embed = new EmbedBuilder()
    .setTitle("Leaderboard in Treasures")
    .setDescription('A leaderboard of people with the highest levels in Treasures');
    const data = await fs.readFile('./leveling/users.json', 'utf8');
    const users = JSON.parse(data);
    const list = await rankUsers(users);
    const limit = Math.min(list.length, 10); // Ensure it doesn’t exceed 10 entries
    for (let i = 0; i < limit; i++) {
        const user = list[i];
        if(user.rank === 1){
            embed.addFields({
                name: `:first_place:.) ${users[user.id].name}`,
                value: `XP: ${users[user.id].msgs * 10} / Level: ${users[user.id].level}`
            });
        }else if(user.rank === 2){
            embed.addFields({
                name: `:second_place:.) ${users[user.id].name}`,
                value: `XP: ${users[user.id].msgs * 10} / Level: ${users[user.id].level}`
            });
        }else if(user.rank === 3){
            embed.addFields({
                name: `:third_place:.) ${users[user.id].name}`,
                value: `XP: ${users[user.id].msgs * 10} / Level: ${users[user.id].level}`
            });
        }else{
        embed.addFields({
            name: `${user.rank}.) ${users[user.id].name}`,
            value: `XP: ${users[user.id].msgs * 10} / Level: ${users[user.id].level}`
        });
        }
    }
    embed.setFooter({text:'Treasures Bot'});
    // Send the embed
    await message.channel.send({ embeds: [embed] });
  }
}