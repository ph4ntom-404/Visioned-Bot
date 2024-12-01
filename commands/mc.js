const { SlashCommandBuilder} = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mc')
    .setDescription('To get a count of all members in the server'),
   execute(message, args) {
    message.channel.send(`There are ${message.guild.memberCount} members in Teasures right now!`)
  }
}