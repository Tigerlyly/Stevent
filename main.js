var mineflayer = require('mineflayer');
var bot = mineflayer.createBot({
  host: "localhost", // optional
  port: 25565,       // optional
  username: "Stevent", // email and password are required only for
  version: false                 // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
});

bot.on('chat', function(username, message) {
  if (username === bot.username) return;
  //bot.chat(message);
  //bot.chat(message.substring(0,6))
  //console.log(message)
  if (message === "!dig") {
    if(bot.blockInSight().diggable) {
      bot.dig(bot.blockInSight())
      //console.log(bot.blockInSight())
    } else {
      bot.chat("I cannot dig " + bot.blockInSight().displayName)
      return
    }
    bot.on("diggingCompleted", (block) => {
      if(bot.blockInSight().diggable) {
        bot.dig(bot.blockInSight())
      } else {
        bot.chat("I cannot dig " + bot.blockInSight().displayName)
      }
      
    })
    
    
  } else if (message.split(" ")[0] === "!echo") {
    returnMessage = message.split(" ")
    returnMessage.shift()
    bot.chat(returnMessage.join(" "))
  }
});

bot.on("spawn", function() {
  bot.chat("I am spawned")
  bot.look(0, -Math.PI/2, true, () => {
    bot.chat("looking somewhere")
  })
})

bot.on('error', err => console.log(err))
