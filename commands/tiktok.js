const { SlashCommandBuilder, EmbedBuilder} = require("discord.js")
const {chromium} = require('playwright')

function formatNumber(num) {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1) + "B"; // Billions
    } else if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + "M"; // Millions
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + "K"; // Thousands
    } else {
      return num.toString(); // Less than 1K
    }
  }
  

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tiktok')
    .setDescription("To retrieve the specified user's tiktok profile"),
   async execute(message, args,client) {
     // Launch browser
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Replace with the TikTok username you want to scrape
    const username = args[0];
    if(!args || args[0] === undefined){
        await message.reply('Please specify a proper TikTok username to look up!(without the "@")');
        return;
    }
    const rep = await message.reply(`Retrieving \`\`\`@${username}\`\`\`'s profle...`)
    const url = `https://www.tiktok.com/@${username}`;
    try{
        await page.goto(url,{waitUntil:'domcontentloaded'})
        const scriptTags = await page.$$eval("script", scripts =>
            scripts.map(script => script.innerHTML)
          );
    
          // Search for the script containing the data
          let dataScript = scriptTags.find(script =>
            script.includes("followerCount")
          );
    
          if (!dataScript) {
            await message.reply(
              `Could not find the profile data for \`\`\`@${username}\`\`\`.`
            );
            return;
          }
    
          // Parse JSON data from the script
          const jsonMatch = dataScript.match(/"stats":({.*?})/);
          if (!jsonMatch || !jsonMatch[1]) {
            await message.reply(
              `Failed to parse the profile data for \`\`\`@${username}\`\`\`.`
            );
            return;
          }
    
          const userData = JSON.parse(jsonMatch[1]);
    
          // Extract profile information
          const followers = formatNumber(userData.followerCount) || "Unknown";
          const likes = formatNumber(userData.heartCount) || "Unknown";
          const following = userData.followingCount || "Unknown";
          const vids = userData.videoCount || "Unknown";
          
          const embed = new EmbedBuilder()
        .setColor(0xff0050)
        .setTitle(`TikTok Profile: @${username}`)
        .setURL(url)
        .setDescription(`Here are the stats for @${username}:`)
        .addFields(
          { name: "Followers", value: followers, inline: true },
          { name: "Following", value: following.toString(), inline: true },
          { name: "Likes", value: likes, inline: true },
          { name: "Videos", value: vids.toString(), inline: true }
        )
        .setTimestamp()
        .setFooter({ text: "Treasures Bot", iconURL: client.user.displayAvatarURL({dynamic:true, size:512}) });
          // Send results to the Discord channel
          await rep.edit(
            {content:'',embeds: [embed]}
          );

    }catch(err){
        console.log(err);
    }
   
  }
}