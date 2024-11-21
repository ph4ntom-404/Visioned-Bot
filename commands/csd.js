const { SlashCommandBuilder} = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('csd')
    .setDescription('send to certain channel'),
   async execute(message, args, client) {
    let msg = '';
    const vis = client.guilds.cache.find(g=> g.name === 'visioned');
    const channel = vis.channels.cache.find(c=> c.name === 'posted')
    if (channel && channel.isTextBased()) {
        const permissions = channel.permissionsFor(channel.guild.members.me);
        if (!permissions || !permissions.has('SendMessages')) {
            console.log(`Bot lacks Send Messages permission in the channel: ${channel.name}`);
            return;
        }
        args.map(l=>{
            msg = msg + " " + l
        })
       await channel.send(msg)
            .then(() => console.log(`Message sent to ${channel.name}`))
            .catch(console.error);
    } else {
        console.log(`Channel is not text-based or not found.`);
    }
  }
}