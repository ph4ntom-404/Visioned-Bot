const {EmbedBuilder} = require('discord.js')

let shames = {};
let fames = {};
module.exports = async function(reaction, user){
    const messageId = reaction.message.id; // Message ID
    const emojiName = reaction.emoji.name; // Emoji name

    // Check if the reaction is the ☠️ emoji
    if (emojiName === '☠️') {
        // If the message is not yet in the shames object, initialize it
        if (!shames.hasOwnProperty(messageId)) {
            shames[messageId] = [messageId, 1];
        } else {
            // Increment the count for the message
            shames[messageId][1] += 1;
        }
        if(shames[messageId][1]>=5){
            const attachments = reaction.message.attachments.map(attachment => attachment.url);
           const shm= await reaction.message.guild.channels.cache.find(c=> c.name === 'hall-of-shame');
           const embed = new EmbedBuilder()
           .setTitle(`${reaction.message.author.globalName} said something stupid`)
           .setThumbnail(reaction.message.author.displayAvatarURL())
           .setDescription(`${reaction.message.content} -<@${reaction.message.author.id}>`)
           .setImage(attachments.length ? attachments[0] : null)
           .setTimestamp();
           await shm.send({embeds:[embed]});
           delete shames[messageId];
           return;
        }
    }else if (emojiName === '⭐') {
        // If the message is not yet in the shames object, initialize it
        if (!fames.hasOwnProperty(messageId)) {
            fames[messageId] = [messageId, 1];
        } else {
            // Increment the count for the message
            fames[messageId][1] += 1;
        }
        if(fames[messageId][1]>=5){
            const attachments = reaction.message.attachments.map(attachment => attachment.url);
           const shm= await reaction.message.guild.channels.cache.find(c=> c.name === 'hall-of-fame');
           const embed = new EmbedBuilder()
           .setTitle(`${reaction.message.author.globalName} js cooked!`)
           .setThumbnail(reaction.message.author.displayAvatarURL())
           .setDescription(`${reaction.message.content} -<@${reaction.message.author.id}>`)
           .setImage(attachments.length ? attachments : null)
           .setTimestamp();
           await shm.send({embeds:[embed]});
           delete fames[messageId];
           return;
        }
    }
    else{
        return;
    }

}