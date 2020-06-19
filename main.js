let mineflayer = require('mineflayer');
const { instruments, blocks } = require('minecraft-data')("1.15.2")
let bot = mineflayer.createBot({
  host: "localhost", // optional
  port: 25565,       // optional
  username: "Stevent", // email and password are required only for
  version: false                 // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
});

let botDest;

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

    bot.on("chat", (username, message) => {
      if (username === bot.username) return;
      if(message === "!stopdig") {
        try {
          bot.stopDigging()
        }
        catch(e) {
          bot.chat("I have stopped digging.")
        }
      }
    })
    
    
  } else if (message.split(" ")[0] === "!echo") {
    returnMessage = message.split(" ")
    returnMessage.shift()
    bot.chat(returnMessage.join(" "))
  }
});

bot.on('chat', (username, message) => {
  if (username === bot.username) return

  const mcData = require('minecraft-data')(bot.version)

  if(message.startsWith("test")) {
    //console.log(Object.keys(mcData.blocksByName))
    // mcData.blocksArray.forEach((block) => {
    //   console.log(block)
    // })
    console.log(mcData.blocksArray.filter((block) => {
      return block.name.includes("log") && !block.name.includes("stripped")
    }))
  }

  if(message.startsWith('look')) {
    const dir = message.split(' ')[1]

    lookDirection(bot, dir, () => {
      bot.chat("Looking in " + dir)
    });
  }

  if (message.startsWith('find')) {
    const name = message.split(' ')[1]
    JSON.parse(mcData.blocksByName).forEach((block) => {
      console.log(block.name)
    })
    // console.log(mcData.blocksByName.filter((block) => {
    //   block.name.includes("log") && !block.name.includes("stripped")
    // }))
    
    // const ids = mcData.findItemOrBlockByName("log").filter((block) => {
    //   block.name.substring(0, 5) !== "strip"
    // })

    let blocks = bot.findBlocks({ matching: ids, maxDistance: 128, minCount: 10 })
    console.log(blocks)

    bot.chat(`I found ${blocks.length} blocks in ms`)
    console.log(bot.entity.position)
    blocks.forEach((block) => {
      console.log(distanceFrom(bot.entity.position, block))
    })
    bot.lookAt(blocks[blocks.length-1], false, () => {
      console.log(distanceFrom(bot.entity.position, blocks[blocks.length-1]))
      botDest = blocks[blocks.length-1]
      // while (distanceFrom(bot.entity.position, blocks[blocks.length-1]) > 3) {
      //   bot.setControlState("forward", true)
      // }
      bot.setControlState("forward", true)
    })
  }
})

bot.on("move", () => {
  //console.log(bot.entity.position)
  if(botDest) {
    console.log(distanceFrom(bot.entity.position, botDest))
    if(distanceFrom(bot.entity.position, botDest) < 8) {
      bot.clearControlStates()
      console.log(distanceFrom(bot.entity.position, botDest))
      console.log(bot.entity.position)
    }
  }
})

bot.on("spawn", function() {
  botDest = bot.entity.position;
  bot.chat("I am spawned")
  setTimeout(() => {
    bot.look(0, -Math.PI/2, true, () => {
      bot.chat("looking straight down")
  })}, 1000)
})

bot.on('error', err => console.log(err))

function distanceFrom(v1, v2) {
  xCoord = v1.x-v2.x
  yCoord = v1.y-v2.y
  zCoord = v1.z-v2.z
  dist = Math.sqrt(Math.pow(xCoord,2) + Math.pow(yCoord,2) + Math.pow(zCoord,2))
  return dist
}

/** Directional look function **/
function lookDirection(botVar, direction, cb = null) {
  yaw = 0;
  switch(direction.toLowerCase()) {
    case 'north':
      yaw = 0;
      break;
    case 'west':
      yaw = Math.PI / 2;
      break;
    case 'south':
      yaw = Math.PI;
      break;
    case 'east':
      yaw = -(Math.PI / 2);
      break;
    case 'northwest':
      yaw = Math.PI / 4;
      break;
    case 'southwest':
      yaw = Math.PI * 3 / 4;
      break;
    case 'southeast':
      yaw = -(Math.PI * 3 / 4);
      break;
    case 'northeast':
      yaw = -(Math.PI * 1 / 4);
      break;
    default:
      console.log("Direction is not supported");
      return;
  }
  botVar.look(yaw, 0, false, cb)
}