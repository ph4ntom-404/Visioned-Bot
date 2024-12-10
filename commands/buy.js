const { SlashCommandBuilder } = require('discord.js')
const shop = require('../shop.json')
const fs = require('node:fs')
function capitalizeString(str) {
    return str
        .split(' ') // Split the string by spaces
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
        .join(' '); // Join the words back together
}
module.exports = {
    data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription('user can purchase an item from the shop'),
    async execute(message, args){
        const item = args.join(' ')
        if(!item){
            return message.channel.send("You didn't specify an item from the shop to purchase!")
        }
        function itemExists(itemName) {
            // Iterate over all categories in the shop
            for (let category in shop) {
                // Check if the item exists in this category
                if (shop[category][itemName]) {
                    return true; // Item found
                }
            }
            return false; // Item znot found
        }
        if(!itemExists(capitalizeString(item))){
            return message.channel.send("That is not a valid shop item!\n Check the shop with `>shop`.");
        }
        try{
        const itmFiles = fs.readdirSync('./inventory').filter(file=> file.endsWith('.js'))
        let purchase;
        if(shop.Roles.hasOwnProperty(capitalizeString(item))){
            purchase = require('../inventory/roles.js')
        }else{
            for(const file of itmFiles){
                if(file.startsWith(`${item.toLowerCase()}.`)){
                    purchase = require(`../inventory/${file}`)
                    break;
                }
            }
        }
        if(!purchase){
            return message.channel.send("Could not find the code for this item!")
        }
        purchase.run(message, shop, capitalizeString(item))
        }catch(err){
            return message.channel.send("Feature is incomplete!")
        }
    }
}