const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder} = require("discord.js")
const Users = require('../models/levels')

async function getRankedUsers(user) {
    try {
      // Fetch all users and sort them by `xp` in descending order
      const rankedUsers = await user.find().sort({ xp: -1 }).exec();
  
      // Map the users to include only userId and rank
      return rankedUsers.map((user, index) => ({
        rank: index + 1,
        userId: user.userId,
        name: user.name,
        xp: user.xp,
        level: user.level
      }));
    } catch (error) {
      console.error('Error fetching ranked users:', error);
      return [];
    }
  }
  

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lb')
    .setDescription("To check the level rank of members in the server"),
  async execute(message, args) {
    const embed = new EmbedBuilder()
    .setTitle("Leaderboard in Treasures")
    .setDescription('A leaderboard of people with the highest levels in Treasures');
    const list = await getRankedUsers(Users);
    const limit = Math.min(list.length, 10); // Ensure it doesn’t exceed 10 entries
    for (let i = 0; i < limit; i++) {
        const user = list[i];
        if(user.rank === 1){
            embed.addFields({
                name: `:first_place:.) ${user.name}`,
                value: `XP: ${user.xp * 10} / Level: ${user.level}`
            });
        }else if(user.rank === 2){
            embed.addFields({
                name: `:second_place:.) ${user.name}`,
                value: `XP: ${user.xp * 10} / Level: ${user.level}`
            });
        }else if(user.rank === 3){
            embed.addFields({
                name: `:third_place:.) ${user.name}`,
                value: `XP: ${user.xp * 10} / Level: ${user.level}`
            });
        }else{
        embed.addFields({
            name: `${user.rank}.) ${user.name}`,
            value: `XP: ${user.xp * 10} / Level: ${user.level}`
        });
        }
    }
    embed.setFooter({text:'Treasures Bot'});
    // Send the embed
    await message.channel.send({ embeds: [embed] });
  }
}