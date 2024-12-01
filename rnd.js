const { SlashCommandBuilder} = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rnd')
    .setDescription('Pick randomly from provided selection'),
   execute(message, args) {
     const choices = args
     for(var x in choices){
        if(x === ' '||x === undefined){
            choices.splice(x);
        }
     }
     if(args[0].startsWith('num')){
      const rest = args[0].slice(4)
         if (!rest) {
            return message.channel.send("Please provide a range to pick from, e.g., `>rnd num 1-100`");
          }
        
          // Parse the range
          const rangeRegex = /^(\d+)-(\d+)$/;
          const match = rest.match(rangeRegex);
          if (!match) {
            return message.channel.send("Invalid range format. Use `>rnd num X-Y` where X and Y are numbers.");
          }
        
          const min = parseInt(match[1], 10);
          const max = parseInt(match[2], 10);
        
          // Validate the range
          if (isNaN(min) || isNaN(max) || min >= max) {
            return message.channel.send("Please provide a valid range where the first number is less than the second.");
          }
        
          // Generate a random number in the range
          const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        
          // Send the result
          return message.channel.send(`🎲 Your random number between ${min} and ${max} is **${randomNum}**!`);;
      }
     if(!choices[0] || choices[0] === ''|| choices[0] === ' '|| choices[0] ==='⠀ ⠀' ){
        message.channel.send("You didn't provide anything to select from!")
        return;
     }
     if(choices.length < 2){
        message.channel.send("Please provide at least 2 options")
        return;
     }
     const choice = choices[Math.round(Math.random()*(choices.length -1))];
     message.channel.send(`**${choice}** has been selected!`);
  }
}