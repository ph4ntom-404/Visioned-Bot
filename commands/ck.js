const { SlashCommandBuilder} = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ck')
    .setDescription('check'),
   execute(message, args) {
     message.channel.send(message.author.globalName)
  }
}