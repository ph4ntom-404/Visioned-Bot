const {Client, Events, GatewayIntentBits, Collection,ActivityType} = require( 'discord.js');
const fs = require('node:fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions] });
require('dotenv').config();
const token = process.env.DISCORD_TOKEN

const rnd = require('./rnd.js')
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
  client.user.setActivity('with my testicles. please come watch', { type: ActivityType.Playing });
});
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://oordankale:7QeUMoXIaz1sw7Ow@meruem.p1hpz.mongodb.net/?retryWrites=true&w=majority&appName=meruem', {
})
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const lvl = require('./leveling/levels.js')
client.on('messageCreate', async message=>{
    const vis = client.guilds.cache.find(g=> g.name === 'Treasures');
    if(message.guild === vis && !message.author.bot){
        lvl(message.author, message);
    }
    if(message.content.toLowerCase().includes('fine shyt') && !message.author.bot){
        message.reply('alr lock in lil bro')
    }
    if(message.content.toLowerCase().includes('glorious king') && !message.author.bot){
        message.reply('yeah js pop it out twin')
    }
    if(message.guild.name !== vis.name){
       console.log(message.embeds);
        const channel = vis.channels.cache.find(c=> c.name === 'posted')
        //const role = vis.roles.cache.find(r=> r.name === 'post-announcement');
        await channel.send({
            content: '<@&1309253230705901678>' + message.content || '',
            embeds: message.embeds
        });

    }
    if(!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const rargs = message.content.slice(prefix.length+4).split(/, +/)
    if(commandName === 'rnd'){
        rnd.execute(message,rargs)
    }
    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        command.execute(message, args,client);
    } catch (error) {
        console.error(error);
        message.reply("There was an error trying to execute that command!");
    }
})
