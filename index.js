const {Client, Events, GatewayIntentBits, Collection} = require( 'discord.js');
const fs = require('node:fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent] });
require('dotenv').config();
const token = process.env.DISCORD_TOKEN

client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
client.login(token);
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);

}

const prefix = ">";
client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('messageCreate', async message=>{
    if(!message.content.startsWith(prefix)) return;
    if(message.author.globalName === 'NotifyMe'){
        const vis = client.guilds.cache.find(g=> g.name === 'visioned');
        const channel = vis.channels.cache.find(c=> c.name === 'posted')
        await channel.send(message.content);

    }
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        command.execute(message, args,client);
    } catch (error) {
        console.error(error);
        message.reply("There was an error trying to execute that command!");
    }
})