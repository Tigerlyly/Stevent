var mineflayer = require('mineflayer');
var Vec3 = require('vec3').Vec3;

var bot = mineflayer.createBot({
  host: "localhost", // optional
  port: 25565,       // optional
  username: "Stevent", // email and password are required only for
  version: false                 // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
});

function logall(chat)
{
  bot.chat(chat);
  console.log(chat);
}

bot.on('chat', function(username, message) {
  if(message == "move")
  {
    var targetLoc = bot.players[username].entity.position;
    moveTo(targetLoc);
  }
  if(message == "move2")
  {
    var targetLoc = bot.players[username].entity.position;
    logall("Starting at " + bot.entity.position + ", moving to " + targetLoc);
    bot.lookAt(targetLoc, true,  () => {
      logall("Start");
      bot.setControlState("forward", true)      
      setTimeout(() => {
        bot.clearControlStates()
        logall("Stop " + bot.entity.position);
        setTimeout(() => {
          logall("End " + bot.entity.position);
          //throw "break"
        }, 300)
        
      }, 255)
    })
  }
});
bot.on('error', err => console.log(err))

var Moving = false;
var MoveToLoc = null;
var successDistance = 0.3;
var failDistance = 0;

function moveTo(position) {
  MoveToLoc = position.clone();
  Moving = true;
  var startLoc = bot.entity.position;

  console.log("Moving from "+startLoc+" to " + MoveToLoc);
  failDistance = MoveToLoc.distanceTo(startLoc) + 2;
  
  bot.lookAt(MoveToLoc, true, function () { 
    console.log("LookAt finished");
    bot.setControlState("forward",true); 
  });

}

bot.on("move", function () {
  if(Moving)
  {
    var dist = bot.entity.position.distanceTo(MoveToLoc);
    console.log("distance = " + dist);
    if(dist < successDistance)
    {
      Moving = false;
      bot.clearControlStates();
      console.log("Completed movement.");
      bot.chat("Completed movement.");
    }
    else if(dist > failDistance)
    {
      Moving = false;
      bot.clearControlStates();
      console.log("Failed in movement!");
      bot.chat("Something went terribly wrong!");
    }
    else
    {
      bot.lookAt(MoveToLoc, true, function () { } );
    }
  }

});
