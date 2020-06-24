let mineflayer = require('mineflayer')
let vec3 = require("vec3")
const { instruments, blocks } = require('minecraft-data')("1.15.2")
let bot = mineflayer.createBot({
  host: "localhost", // optional
  port: 25565,       // optional
  username: "Stevent", // email and password are required only for
  version: false                 // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
});

// bot.on('chat', function(username, message) {
//   if (username === bot.username) return;
//   //bot.chat(message);
//   //bot.chat(message.substring(0,6))
//   //console.log(message)
//   if (message === "!dig") {
//     if(bot.blockInSight().diggable) {
//       bot.dig(bot.blockInSight())
//       //console.log(bot.blockInSight())
//     } else {
//       bot.chat("I cannot dig " + bot.blockInSight().displayName)
//       return
//     }
//     bot.on("diggingCompleted", (block) => {
//       if(bot.blockInSight().diggable) {
//         bot.dig(bot.blockInSight())
//       } else {
//         bot.chat("I cannot dig " + bot.blockInSight().displayName)
//       }
//     })

//     bot.on("chat", (username, message) => {
//       if (username === bot.username) return;
//       if(message === "!stopdig") {
//         try {
//           bot.stopDigging()
//         }
//         catch(e) {
//           bot.chat("I have stopped digging.")
//         }
//       }
//     })
    
    
//   } else if (message.split(" ")[0] === "!echo") {
//     returnMessage = message.split(" ")
//     returnMessage.shift()
//     bot.chat(returnMessage.join(" "))
//   }
// });

bot.on('chat', (username, message) => {
  if (username === bot.username) return

  const mcData = require('minecraft-data')(bot.version)



  if(message.startsWith("test")) {
    console.log(bot.entity.position)
    bot.setControlState("jump", true)
    setTimeout(() => {
      bot.setControlState("jump", false)
    }, 3000)
  }

  // if (message.startsWith("center")) {
  //   const dir = message.split(" ")[1]

  //   lookDirection(bot, dir, () => {
  //     bot.setControlState("forward", true)
  //     console.log("start")
  //     setTimeout(() => {
  //       bot.clearControlStates()
  //       console.log("clear control")
  //       setTimeout(() => {
  //         console.log("end")
  //         throw "break"
  //       }, 300)
        
  //     }, 255)
  //   })
  // }

  if (message === "come") {
    let starttime = Date.now()
    let pf = new Pathfinder(bot)
    let ep = bot.players[username].entity.position.floor()
    //console.log(ep)
    let {pl, numBlocksExamined} = pf.aStar(bot.entity.position.floor(), ep)
    let endtime = Date.now() - starttime
    if(pl.length > 0)
    {
      pl.forEach((el) => {
        console.log(el.position)
      })
      pf.reducePath(pl)
    } else {
      bot.chat("I cannot find a way there")
    }
    console.log("Path length: " + pl.length)
    console.log(numBlocksExamined + " blocks examined in " + endtime + " ms")

    pf.pathTo(ep)
  }

  if (message === "here") {
    console.log(bot.entity.height)
    let pf = new Pathfinder(bot)
    pf.moveTo(bot.players[username].entity.position.floored().offset(0.5, 0, 0.5))
  }

  if(message.startsWith('look')) {
    const dir = message.split(' ')[1]

    lookDirection(bot, dir, () => {
      bot.chat("Looking " + dir)
    });
  }

  if (message.startsWith('find')) {
    // const name = message.split(' ')[1]
    // JSON.parse(mcData.blocksByName).forEach((block) => {
    //   console.log(block.name)
    // })
    // console.log(mcData.blocksByName.filter((block) => {
    //   block.name.includes("log") && !block.name.includes("stripped")
    // }))
    
    // const ids = mcData.findItemOrBlockByName("log").filter((block) => {
    //   block.name.substring(0, 5) !== "strip"
    // })

    const logblocks = mcData.blocksArray.filter((block) => {
      return block.name.includes("log") && !block.name.includes("stripped")
    })

    const ids = logblocks.map((block) => {
      return block.id
    })

    console.log(ids)
    let starttime = Date.now()
    let blocks = bot.findBlocks({ matching: ids, maxDistance: 128, minCount: 10 })
    //console.log(blocks)
    let finaltime = Date.now() - starttime

    
    bot.chat(`I found ${blocks.length} blocks in ${finaltime} ms`)
    
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
  // if(botDest) {
  //   console.log(distanceFrom(bot.entity.position, botDest))
  //   if(distanceFrom(bot.entity.position, botDest) < 8) {
  //     bot.clearControlStates()
  //     console.log(distanceFrom(bot.entity.position, botDest))
  //     console.log(bot.entity.position)
  //   }
  // }
})

bot.on("spawn", function() {
  //botDest = bot.entity.position;
  // setInterval(() => {
  //   console.log(bot.entity.position, bot.entity.velocity, bot.entity.position.add(bot.entity.velocity))
  // }, 50)
  bot.chat("I am spawned")
  // setTimeout(() => {
  //   bot.look(0, -Math.PI/2, true, () => {
  //     bot.chat("looking straight down")
  // })}, 1000)
})

bot.on('error', err => console.log(err))

/** Distance function for 3d Vecs **/
/** Input is 2 vec3 objects that represent points in 3d space **/
/** Returns the l2 distance between the 2 points **/
function distanceFrom(v1, v2) {
  let xCoord = v1.x-v2.x
  let yCoord = v1.y-v2.y
  let zCoord = v1.z-v2.z
  let dist = Math.sqrt(Math.pow(xCoord,2) + Math.pow(yCoord,2) + Math.pow(zCoord,2))
  return dist
}

/** Directional look function **/
/** Input is a mineflayer bot, a direction in string form, and an optional callback function **/
/** This forces the bot to look in a certain direction. **/
function lookDirection(botVar, direction, cb = null) {
  let yaw = 0;
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

/** Function to return the direction that the bot is facing. Returns one of 8 directions (4 cardinal, 4 diagonal) **/
/** Input is a mineflayer bot **/
/** Return value is a string of which way the bot is facing if one of 8 main directions, otherwise return string explaining **/
function getLookDirection(botVar) {
  switch(botVar.entity.yaw) {
    case 0:
      return "north"
    case Math.PI / 2:
      return "west"
    case Math.PI:
      return "south"
    case -(Math.PI / 2):
      return "east"
    case Math.PI / 4:
      return "northwest"
    case Math.PI * 3 / 4:
      return "northeast"
    case -(Math.PI * 3 / 4):
      return "southeast"
    case -(Math.PI * 1 / 4):
      return "southwest"
    default:
      return "some other direction"
  }
}

/** Function to see if bot can move in a certain direction **/
/** Input is a mineflayer bot and a direction **/
/**  **/
function canMove(botVar, direction) {
  let pf = new Pathfinder(botVar)
  let {moveAble, coords} = pf.canMoveDir(botVar.entity.position, direction)
  return {moveAble, coords}
  // let jumpAble = false;
  // let moveAble = false;
  // let botPos = botVar.entity.position;
  // let aboveBot = botVar.blockAt(botPos.offset(0,2,0))
  // switch(direction) {
  //   case "north":
  //     //offset to the north  = (0, y, -1)
  //     block0 = botVar.blockAt(botPos.offset(0,-2,-1))
  //     block1 = botVar.blockAt(botPos.offset(0,-1,-1))
  //     block2 = botVar.blockAt(botPos.offset(0,0,-1))
  //     block3 = botVar.blockAt(botPos.offset(0,1,-1))
  //     block4 = botVar.blockAt(botPos.offset(0,2,-1))
  //     console.log(botVar.blockAt(botPos.offset(0,-1,-1)))
  //     break;
  //   case "east":
  //     //offset to the east  = (1, y, 0)
  //     block0 = botVar.blockAt(botPos.offset(1,-2,0))
  //     block1 = botVar.blockAt(botPos.offset(1,-1,0))
  //     block2 = botVar.blockAt(botPos.offset(1,0,0))
  //     block3 = botVar.blockAt(botPos.offset(1,1,0))
  //     block4 = botVar.blockAt(botPos.offset(1,2,0))
  //     console.log(botVar.blockAt(botPos.offset(1,-1,0)))
  //     break;
  //   case "south":
  //     //offset to the south  = (0, y, 1)
  //     block0 = botVar.blockAt(botPos.offset(0,-2,1))
  //     block1 = botVar.blockAt(botPos.offset(0,-1,1))
  //     block2 = botVar.blockAt(botPos.offset(0,0,1))
  //     block3 = botVar.blockAt(botPos.offset(0,1,1))
  //     block4 = botVar.blockAt(botPos.offset(0,2,1))
  //     console.log(botVar.blockAt(botPos.offset(0,-1,1)))
  //     break;
  //   case "west":
  //     //offset to the west  = (-1, y, 0)
  //     block0 = botVar.blockAt(botPos.offset(-1,-2,0))
  //     block1 = botVar.blockAt(botPos.offset(-1,-1,0))
  //     block2 = botVar.blockAt(botPos.offset(-1,0,0))
  //     block3 = botVar.blockAt(botPos.offset(-1,1,0))
  //     block4 = botVar.blockAt(botPos.offset(-1,2,0))
  //     console.log(botVar.blockAt(botPos.offset(-1,-1,0)))
  //     break;
  // }
  
  // const idsToAvoid = [26,27]

  // if(block1.boundingBox === "block" && block2.boundingBox === "empty" && block3.boundingBox === "empty") {
  //   if(idsToAvoid.includes(block2.type) || idsToAvoid.includes(block3.type)) {
  //     console.log(false)
  //   } else {
  //     console.log(true)
  //     moveAble = true;
  //   }
  // } else if (block0.boundingBox === "block" && block1.boundingBox === "empty" && block2.boundingBox === "empty") {
  //   if(idsToAvoid.includes(block1.type) || idsToAvoid.includes(block2.type)) {
  //     console.log(false)
  //   } else {
  //     console.log(true + " down one")
  //     moveAble = true;
  //   }
  // } else if (block2.boundingBox === "block" && block3.boundingBox === "empty" && block4.boundingBox === "empty" && aboveBot.boundingBox === "empty") {
  //   if(idsToAvoid.includes(block3.type) || idsToAvoid.includes(block4.type)) {
  //     console.log(false)
  //   } else {
  //     console.log(true + " need jump")
  //     jumpAble = true;
  //   }
  // } else {
  //   console.log(false)
  // }
}

class Pathfinder {
  
  constructor(botVar) {
    this.botVar = botVar;
    this.botDest = null
    this.MOVING = false
    this.SUCCESS_DISTANCE = 0.3
    this.FAIL_DISTANCE = 0;
  }

  canMoveDir(point, direction) {
    let abovePos = this.botVar.blockAt(point.offset(0,2,0))
    let block0, block1, block2, block3, block4 = null;
    switch(direction) {
      case "north":
        //offset to the north  = (0, y, -1)
        block0 = this.botVar.blockAt(point.offset(0,-2,-1))
        block1 = this.botVar.blockAt(point.offset(0,-1,-1))
        block2 = this.botVar.blockAt(point.offset(0,0,-1))
        block3 = this.botVar.blockAt(point.offset(0,1,-1))
        block4 = this.botVar.blockAt(point.offset(0,2,-1))
        //console.log(this.botVar.blockAt(point.offset(0,-1,-1)))
        break;
      case "east":
        //offset to the east  = (1, y, 0)
        block0 = this.botVar.blockAt(point.offset(1,-2,0))
        block1 = this.botVar.blockAt(point.offset(1,-1,0))
        block2 = this.botVar.blockAt(point.offset(1,0,0))
        block3 = this.botVar.blockAt(point.offset(1,1,0))
        block4 = this.botVar.blockAt(point.offset(1,2,0))
        //console.log(this.botVar.blockAt(point.offset(1,-1,0)))
        break;
      case "south":
        //offset to the south  = (0, y, 1)
        block0 = this.botVar.blockAt(point.offset(0,-2,1))
        block1 = this.botVar.blockAt(point.offset(0,-1,1))
        block2 = this.botVar.blockAt(point.offset(0,0,1))
        block3 = this.botVar.blockAt(point.offset(0,1,1))
        block4 = this.botVar.blockAt(point.offset(0,2,1))
        //console.log(this.botVar.blockAt(point.offset(0,-1,1)))
        break;
      case "west":
        //offset to the west  = (-1, y, 0)
        block0 = this.botVar.blockAt(point.offset(-1,-2,0))
        block1 = this.botVar.blockAt(point.offset(-1,-1,0))
        block2 = this.botVar.blockAt(point.offset(-1,0,0))
        block3 = this.botVar.blockAt(point.offset(-1,1,0))
        block4 = this.botVar.blockAt(point.offset(-1,2,0))
        //console.log(this.botVar.blockAt(point.offset(-1,-1,0)))
        break;
    }
    
    const idsToAvoid = [26,27]
  
    if(block1.boundingBox === "block" && block2.boundingBox === "empty" && block3.boundingBox === "empty") {
      if(idsToAvoid.includes(block2.type) || idsToAvoid.includes(block3.type)) {
        return {moveAble: false, coords: block2.position}
      } else {
        return {moveAble: true, coords: block2.position}
      }
    } else if (block0.boundingBox === "block" && block1.boundingBox === "empty" && block2.boundingBox === "empty") {
      if(idsToAvoid.includes(block1.type) || idsToAvoid.includes(block2.type)) {
        return {moveAble: false, coords: block1.position}
      } else {
        return {moveAble: true, coords: block1.position}
      }
    } else if (block2.boundingBox === "block" && block3.boundingBox === "empty" && block4.boundingBox === "empty" && abovePos.boundingBox === "empty") {
      if(idsToAvoid.includes(block3.type) || idsToAvoid.includes(block4.type)) {
        return {moveAble: false, coords: block3.position}
      } else {
        return {moveAble: true, coords: block3.position}
      }
    } else {
      return {moveAble: false, coords: this.botVar.blockAt(point)}
    }
  }

  pathTo(position, cb = null) {
    let {pl, numBlocksExamined} = this.aStar(bot.entity.position.floor(), position)
    let reducedVecList = this.reducePath(pl)
    let reducedPath = [this.botVar.entity.position.floored().offset(.5, 0, .5)]
    for (let node of reducedVecList) {
      reducedPath.push(reducedPath[reducedPath.length - 1].plus(node))
    }
    console.log("reduced path below")
    for (let node of reducedPath) {
      console.log(node)
    }
    this.moveTo(reducedPath.shift())
    bot.on("finishedMove", () => {
      if (reducedPath.length > 0) {
        this.moveTo(reducedPath.shift())
      }
    })
  }

  moveTo(position, cb = null) {
    this.botDest = position.clone()
    this.MOVING = true
    let startPos =  this.botVar.entity.position
    let lookAtVal = this.botDest.offset(0, this.botVar.entity.height, 0)

    console.log(`Moving to ${position.toString()} from ${startPos.toString()}`)
    this.FAIL_DISTANCE = position.distanceTo(startPos) + 2

    this.botVar.lookAt(lookAtVal, true, () => {
      console.log("Finished looking at")
      this.botVar.setControlState("forward", true)
      if (this.botDest.minus(startPos).y > .5) {
        this.botVar.setControlState("jump", true)
      }
    })

    this.botVar.on("move", () => {
      if (this.MOVING) {
        let dist = this.botVar.entity.position.distanceTo(this.botDest)
        console.log(`Distance = ${dist}`)
        if (dist < 0.71) {
          bot.setControlState("jump", false)
        }
        if (dist < this.SUCCESS_DISTANCE) {
          this.MOVING = false
          this.botVar.clearControlStates()
          this.botDest = null;
          console.log("finished moving")
          this.botVar.emit("finishedMove")
        } else if (dist > this.FAIL_DISTANCE) {
          this.MOVING = false
          this.botVar.clearControlStates()
          this.botDest = null;
          console.log("failed movement, out of range")
        } else {
          this.botVar.lookAt(lookAtVal, true, () => {})
        }
      }
    })
  }

  reducePath(listOfNodes) {
    let deltaVecs = []
    for (let i = 1; i < listOfNodes.length; i++) {
      deltaVecs.push(listOfNodes[i].position.minus(listOfNodes[i-1].position))
    }
    console.log("deltaVecs before compression: ")
    for (let node of deltaVecs) {
      console.log(node)
    }
    for (let i = 0; i < deltaVecs.length; i++) {
      let tv = deltaVecs[i]
      let count = 1
      if (i !== deltaVecs.length-1) {
        while (deltaVecs[i+1].equals(tv)) {
          count++
          deltaVecs.splice(i+1, 1)
          if (i === deltaVecs.length - 1) {
            break
          }
        }
      }
      deltaVecs[i].scale(count)
    }
    console.log("deltaVecs after compression : ")
    for (let node of deltaVecs) {
      console.log(node)
    }
    return deltaVecs
  }

  pathToFollow(listOfNodes) {
    let pathList = []
    let current = listOfNodes[listOfNodes.length - 1]
    // console.log(current)
    // console.log("Parent VVVVVVVV")
    // console.log(current.parent.parent)
    // console.log("Parent ^^^^^^")
    // console.log(listOfNodes.length)
    while (current.parent !== undefined) {
      //console.log(current.position)
      pathList.push(current)
      current = current.parent
    }
    pathList.reverse()
    return pathList
  }

  aStar(startpoint, endpoint) {
    let openList = []
    let closedList = []
    let md = startpoint.manhattanDistanceTo(endpoint)

    openList.push(new AStarNode(startpoint, 0, md))

    let pathfound = false

    while(true && openList.length + closedList.length <= md * 10) {
      let current = null;
      let currentIndex = 0;
      if(openList.length > 1) {
        let fCostList = openList.map((el) => el.f_cost)
        let lowestFCost = Math.min(...fCostList)
        let lowestfCostList = openList.filter((el) => el.f_cost === lowestFCost)
        //console.log(lowestfCostList)
        if (lowestfCostList.length > 1){
          let hCostList = lowestfCostList.map((el) => el.h_cost)
          let lowestHCost = Math.min(...hCostList)
          let lowestHCostPos = lowestfCostList.find((el) => el.h_cost === lowestHCost).position
          currentIndex = openList.findIndex((el) => el.position.equals(lowestHCostPos))
        } else {
          currentIndex = openList.findIndex((el) => el.f_cost === lowestFCost)
        }
      }
      current = openList.splice(currentIndex, 1)[0]
      closedList.push(current)

      // console.log(openList)
      // console.log(closedList)
      // console.log(current)
      // console.log(current.position)
      
      if(endpoint.equals(current.position)) {
        pathfound = true
        break
      }

      let neighbors = ["north", "east", "south", "west"]
      for (let i = 0; i < 4; i++) {
        let {moveAble, coords} = this.canMoveDir(current.position, neighbors[i])
        //console.log(closedList)
        if (moveAble === false || closedList.findIndex((el) => el.position.equals(coords)) !== -1) {
          continue
        }
        if (openList.findIndex((el) => el.position.equals(coords)) !== -1) {
          let node = openList.find((el) => el.position.equals(coords))
          let newg = current.g_cost + 1
          let newf = newg + node.h
          if (newf < node.f_cost) {
            node.f_cost = newf
            node.parent = current
          }
        } else {
          openList.push(new AStarNode(coords, current.g_cost+1, endpoint.manhattanDistanceTo(coords), current))
        }
      }
    }

    if (pathfound) {
      let pl = this.pathToFollow(closedList)
      let numBlocksExamined = closedList.length + openList.length
      return {pl, numBlocksExamined}
    } else {
      let numBlocksExamined = closedList.length + openList.length
      console.log("Pathfinding explored too many blocks")
      return {pl: [], numBlocksExamined}
    }
  }
}

class AStarNode {
  //f_cost = 0;
  constructor(position, g_cost = 0, h_cost = 0, parent = "null") {
    //g is dist from start node
    //h is dist to end node
    //f is total
    this.position = position
    this.g_cost = g_cost
    this.h_cost = h_cost
    this.parent = parent
    this.f_cost = this.g_cost + this.h_cost;
  }

  equals(node2) {
    if(node2.position.equals(this.position)) {
      return true
    }
    return false
  }
}