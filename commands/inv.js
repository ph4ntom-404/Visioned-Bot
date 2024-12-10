const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Users = require('../models/User');
const shop = require('../shop.json')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('inv')
    .setDescription("Allows users to view the items in their inventory"),
    async execute(message, args,client){
        const person = message.author;
        let user = await Users.findOne({userId: person.id})
        if(!user){
            user = new Users({
                userId:person.id,
                name: person.globalName || person.username
            })
            await user.save();
            return message.channel.send("You do not have any items in your inventory!")
        }
        if (!user.inventory || user.inventory.length === 0) {
            return message.channel.send("You do not have any items in your inventory!");
        }
        const generateEmbed=(page)=>{
            const embed = new EmbedBuilder()
            .setTitle(`${user.name}'s Inventory`)
            .setColor(0x5094b2)
            .setTimestamp()
            .setFooter({text:'Meruem',iconURL:client.user.displayAvatarURL()});
            const start = (page - 1) * 10;
            const end = start + 10;
            const pgitms = user.inventory.slice(start, end)
            pgitms.forEach((itm) => {
                let categ;
                for (const [category, items] of Object.entries(shop)) {
                    if (items.hasOwnProperty(itm)) {
                        categ = items;
                        break;
                    }
                }
                if (categ) {
                    embed.addFields({
                        name: itm,
                        value: ` \  **Description:** *${categ[itm].description}*\n${categ[itm].expires ? `*Expires in ${(categ[itm].expires) / 1000 / 60 / 60} hours*` : ''}`,
                        inline: true
                    });
                }
            });
            return embed;
        }
        let currentPage = 1
        const inv = await message.channel.send({embeds:[generateEmbed(currentPage)]})
        const totalPages = Math.ceil(user.inventory.length/10)
         // Add reactions for navigation
         await inv.react("⬅️");
         await inv.react("➡️");
 
         // Create a reaction collector
         const filter = (reaction, user) =>
             ["⬅️", "➡️"].includes(reaction.emoji.name) && !user.bot;
         const collector = inv.createReactionCollector({
             filter,
             time: 60000, // Collect for 1 minute
         });
 
         collector.on("collect", (reaction, user) => {
             // Remove the user's reaction to avoid clutter
             reaction.users.remove(user);
 
             // Navigate pages based on the reaction
             if (reaction.emoji.name === "➡️" && currentPage < totalPages) {
                 currentPage++;
             } else if (reaction.emoji.name === "⬅️" && currentPage > 1) {
                 currentPage--;
             }
 
             // Update the embed with the new page
             inv.edit({ embeds: [generateEmbed(currentPage)] });
         });
 
         collector.on("end", () => {
             // Remove reactions when the collector ends
             inv.reactions.removeAll().catch(console.error);
         });
    }
}