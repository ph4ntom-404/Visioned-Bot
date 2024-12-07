const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const wordbank = [
    'fat', 'great', 'truck', 'banana', 'creased', 'created',"Nigger",
    'battle','Fable', 'Quirk', 'Lemon', 'Orbit', 'crossed', 'Mosaic', 
    'Jumble', 'Prism', 'Echoes', 'Glisten','Wombat', 'zesty', 'Quiver', 
    'Nimbus', 'Frolic', 'Spire', 'Enigma', 'Velvet', 'Thirst', 'Cactus',
    'Twilight', 'Mellow', 'Breeze', 'Zenith', 'Whimsy', 'Fossil', 'Gazebo', 'Spirit', 
    'inflate', 'Puddle','Elate', 'Meadow', 'Atomic', 'Ripple', 'Convey', 'Swoop', 'Vortex', 'snap', 
    'Gargle', 'Fickle','Dapper', 'Lagoon', 'Rumble', 'Kettle', 'Nerve', 'Dizzy', 'Sprout', 'Swoosh', 
    'Jovial', 'Tangle','Marvel', 'Crisp', 'Bamboo', 'Trivia', 'Puzzle', 'Grumpy', 'Swivel', 'Whisper', 
    'Sprinkle', 'Cozy','Country', 'Magenta', 'Rhythm', 'Luminous', 'Bounty', 'Harmony', 'Vivid', 'Serene', 
    'Majestic', 'Quint', "Happy", "Regress", "Grateful", "Hungry", "Author", "Crazy", "Insane","Goon", "Fright", "Fear","Careful",
    "Cloud", "Lazy", "Greedy", "Hunter", 'Gooning', "Edge", 'Edging','Beautiful','Peace',"Peaceful", 'Aura','Phantom',"Welcome","Smash","Trash"
]; 
const als = 'abcdefghijklmnopqrstuwvqxyz'
const alphabet = als.toUpperCase().split('')
const User = require('../models/User');
function renderWord(word, guessed) {
    return word
      .split("")
      .map((letter) => (guessed.has(letter) ? letter : "\\_"))
      .join(" ");
  }
  
  function isWordGuessed(word, guessed) {
    return word.split("").every((letter) => guessed.has(letter));
  }
  function emojiToLetter(emoji) {
    const regionalIndicatorStart = 0x1F1E6; // Unicode for 🇦
    const letterStart = 65; // ASCII for 'A'
    if (emoji.codePointAt(0) >= regionalIndicatorStart && emoji.codePointAt(0) <= regionalIndicatorStart + 25) {
        return String.fromCharCode(letterStart + (emoji.codePointAt(0) - regionalIndicatorStart));
    }
    return null; // Return null if the emoji is not a regional indicator
}
module.exports = {
    data: new SlashCommandBuilder()
    .setName('hangman')
    .setDescription('Initiates a game of hangman'), 
    async execute(message,args,client){
        const guessed = new Set();
        const wrongGuesses = new Set();
        const wrd = wordbank[Math.floor(Math.random()*wordbank.length)].toUpperCase();
        const maxWrong = 5;
        const embed = new EmbedBuilder()
        .setTitle(`${message.author.globalName} is playing hangman!`)
        .setDescription(await renderWord(wrd,guessed))
        .addFields(
            { name: "Wrong Guesses", value: "None", inline: true },
            { name: "Remaining Attempts", value: `${maxWrong}`, inline: true }
          )
        .setTimestamp()
        .setFooter({text:'React with a letter to guess',iconURL:client.user.displayAvatarURL()});
        const game = await message.channel.send({embeds:[embed]});
        const filter = (reaction, user) => alphabet.includes(emojiToLetter(reaction.emoji.name))&&!user.bot && user === message.author;
          const collector = await game.createReactionCollector({
            filter,
            time: 420000, // 1 minute game duration
          });
      
          collector.on("collect", async (reaction, user) => {
            const letter = emojiToLetter(reaction.emoji.name.toLowerCase());
      
            if (guessed.has(letter) || wrongGuesses.has(letter)) {
              return; // Letter already guessed
            }
      
            if (wrd.includes(letter)) {
              guessed.add(letter); // Correct guess
            } else {
              wrongGuesses.add(letter); // Incorrect guess
            }
      
            // Update the embed
            embed.setDescription(renderWord(wrd, guessed))
              .setFields(
                {
                  name: "Wrong Guesses",
                  value: wrongGuesses.size > 0 ? Array.from(wrongGuesses).join(", ") : "None",
                  inline: true,
                },
                {
                  name: "Remaining Attempts",
                  value: `${maxWrong - wrongGuesses.size}`,
                  inline: true,
                }
              );
      
            // Check for win/loss
            if (wrongGuesses.size >= maxWrong) {
              embed.setColor(0xff0000)
                .setTitle("Game Over!")
                .setDescription(`You lost! The word was **${wrd}**.`);
              collector.stop();
            } else if (isWordGuessed(wrd, guessed)) {
              embed.setColor(0x00ff00)
                .setTitle("You Win!")
                .setDescription(`Congratulations! The word was **${wrd}**.\n**+500 Nen**`);
                const amt = 500;
                let user = await User.findOne({
                  userId:message.author.id
                })
                if(!user){
                  user = new User({
                    userId:message.author.id,
                    name:message.author.globalName,
                    balance:amt
                  });
                }else{
                  user.balance+=amt;
                }
                  await user.save();
              collector.stop();
            }
      
            return game.edit({ embeds: [embed] });
          });
      
          collector.on("end", () => {
            game.reactions.removeAll().catch(console.error);
            try{
            game.edit({content:"The Game has ended!"})
            }catch(err){
              console.log("error trying to send the message for hangman")
              return;
            }
          });
        
    }


}