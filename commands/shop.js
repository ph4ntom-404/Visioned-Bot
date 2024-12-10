const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const shop = require('../shop.json');
const users = require('../models/User')
const formatter = new Intl.NumberFormat('en-US');
module.exports = {
    data:  new SlashCommandBuilder()
    .setName('shop')
    .setDescription('shop to buy inventory items'),
    async execute(message, args, client){
        const categories = Object.keys(shop).reverse(); // ['Roles', 'Perks', 'Utility']
        let currentPage = 0;

        // Function to create an embed for a specific category
        function createEmbed(category) {
            const items = shop[category];
            const embed = new EmbedBuilder()
                .setTitle(`Treasures Nen Shop - ${category}`)
                .setDescription('**Shop to buy inventory items!**\n*(More items will get added later)*\n*Use the reactions below to navigate through the categories.*')
                .setColor(0x5094b2)
                .setTimestamp()
                .setFooter({text:'Meruem',iconURL:client.user.displayAvatarURL()})

            Object.entries(items).forEach(([itemName, details]) => {
                embed.addFields({
                    name: itemName,
                    value: `**Price:** *${formatter.format(details.price)}* Nen\n**Description:** *${details.description}*${details.expires ? `\n**Expires in:** *${details.expires / 1000 / 60 / 60} hours*` : ''}`,
                    inline: false,
                });
            })

            return embed;
        }

        const embedMessage = await message.channel.send({
            embeds: [createEmbed(categories[currentPage])]
        });

        // Add navigation reactions
        await embedMessage.react('⬅️');
        await embedMessage.react('➡️');

        const filter = (reaction, user) => {
            return ['⬅️', '➡️'].includes(reaction.emoji.name);
        };

        const collector = embedMessage.createReactionCollector({ filter, time: 120000 });

        collector.on('collect', (reaction, user) => {
            // Update current page based on reaction
            if (reaction.emoji.name === '➡️') {
                currentPage = (currentPage + 1) % categories.length; // Loop back to the first page
            } else if (reaction.emoji.name === '⬅️') {
                currentPage = (currentPage - 1 + categories.length) % categories.length; // Loop to the last page
            }

            // Update the embed
            embedMessage.edit({ embeds: [createEmbed(categories[currentPage])] });
            reaction.users.remove(user.id); // Remove the user's reaction to allow re-clicking
        });

        collector.on('end', () => {
            embedMessage.reactions.removeAll().catch(() => {});
        });
    }
}