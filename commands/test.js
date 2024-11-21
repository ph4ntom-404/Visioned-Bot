const { SlashCommandBuilder} = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Test function'),
   execute(message, args) {
     message.channel.send('Yo wsg gng')
  }
}