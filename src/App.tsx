import './App.css'

interface entityInterface {
  coordinates: {
    x: {
      value: number
      min: number
      max: number
    }
    y: {
      value: number
      min: number
      max: number
    }
  }
  hitbox: {
    height: number
    width: number
  }
}

interface playerInterface extends entityInterface {
  points: number
}

interface obstacleInterface extends entityInterface {
  speed: number
}

function App() {

  let player: playerInterface = {
    coordinates: {
      x: {
        value: 100,
        min: 0,
        max: 1536
      },
      y: {
        value: 0,
        min: 0,
        max: 700
      }
    },
    hitbox: {
      height: 10,
      width: 10
    },
    points: 0
  }

  // bottomObstacle.coordinates.y + bottomObstacle.hitbox.height må være mellom 0-700
  // bottomObstacle.coordinates.x + bottomObstacle.hitbox.width må være mellom 0-1536

  let bottomObstacle: obstacleInterface = {
    coordinates: {
      x: {
        value: 0,
        min: 750,
        max: 1536
      },
      y: {
        value: 0,
        min: 0,
        max: 700
      }
    },
    hitbox: {
      height: 10,
      width: 10
    },
    speed: 0
  }

  let topObstacle: obstacleInterface = {
    coordinates: {
      x: {
        value: 0,
        min: 750,
        max: 1536
      },
      y: {
        value: 0,
        min: 0,
        max: 700
      }
    },
    hitbox: {
      height: 10,
      width: 10
    },
    speed: 0
  }

  function generateObstacles() {

    let coordX = -1
    let topY = -1
    let bottomY = -1

    let opening = 200

    
    while (coordX < bottomObstacle.coordinates.x.min) {coordX = Math.floor(Math.random() * topObstacle.coordinates.x.max)}

    bottomY = Math.floor(Math.random() * bottomObstacle.coordinates.y.max)
    topY = bottomY - opening

    // apply changes to obstacles

    bottomObstacle.coordinates.x.value = coordX
    bottomObstacle.coordinates.y.value = bottomY
    bottomObstacle.hitbox.height = 100
    bottomObstacle.hitbox.width = 100
    bottomObstacle.speed = 10

    topObstacle.coordinates.x.value = coordX
    topObstacle.coordinates.y.value = topY
    topObstacle.hitbox.height = 100
    topObstacle.hitbox.width = 100
    topObstacle.speed = 10

    return (
      <>
      <div>
      <div className='bg-green-500 p-1 absolute' id='top-obstacle'>
        <p>top</p>
      </div>

      <div className='bg-green-500 p-1 absolute' id='bottom-obstacle'>
        <p>bottom</p>  
      </div>
      </div>
      </>
    )
  }

  function modifyObstacles() {

    // modify x coordinates by speed

    bottomObstacle.coordinates.x.value -= bottomObstacle.speed
    topObstacle.coordinates.x.value -= topObstacle.speed

    // apply changes to DOM

    document.getElementById('top-obstacle')?.style.setProperty('height', `${topObstacle.hitbox.height}px`)
    document.getElementById('top-obstacle')?.style.setProperty('width', `${topObstacle.hitbox.width}px`)
    document.getElementById('top-obstacle')?.style.setProperty('top', `${topObstacle.coordinates.y.value}px`)
    document.getElementById('top-obstacle')?.style.setProperty('left', `${topObstacle.coordinates.x.value}px`)

    document.getElementById('bottom-obstacle')?.style.setProperty('height', `${bottomObstacle.hitbox.height}px`)
    document.getElementById('bottom-obstacle')?.style.setProperty('width', `${bottomObstacle.hitbox.width}px`)
    document.getElementById('bottom-obstacle')?.style.setProperty('top', `${bottomObstacle.coordinates.y.value}px`)
    document.getElementById('bottom-obstacle')?.style.setProperty('left', `${bottomObstacle.coordinates.x.value}px`)
  }

  function checkForCollision() {

    if (player.coordinates.x.value < bottomObstacle.coordinates.x.value + bottomObstacle.hitbox.width &&
      player.coordinates.x.value + player.hitbox.width > bottomObstacle.coordinates.x.value &&
      player.coordinates.y.value < bottomObstacle.coordinates.y.value + bottomObstacle.hitbox.height &&
      player.coordinates.y.value + player.hitbox.height > bottomObstacle.coordinates.y.value) {
      console.log("collision detected! with bottomObstacle")
    }

    if (player.coordinates.x.value < topObstacle.coordinates.x.value + topObstacle.hitbox.width &&
      player.coordinates.x.value + player.hitbox.width > topObstacle.coordinates.x.value &&
      player.coordinates.y.value < topObstacle.coordinates.y.value + topObstacle.hitbox.height &&
      player.coordinates.y.value + player.hitbox.height > topObstacle.coordinates.y.value) {
      console.log("collision detected! with topObstacle")
    }
    
    console.log('checkForCollision')
  }

  function flap() {
    player.coordinates.y.value -= 75
    console.log('flap')
  }

  function gravity() {
    if (player.coordinates.y.value < player.coordinates.y.max) {
    player.coordinates.y.value += 5
    }
  }

  function startGame() {
    console.log('startGame')
    setInterval(() => {
      gravity()
      //checkForCollision()
      modifyObstacles()
      modifyPlayer()
    }, 100)
  }

  function createPlayer() {
    return (
      <>
        <div className='bg-blue-500 p-1 absolute' id='player'>
          <p>player</p>
        </div>
      </>
    )
  }

  function modifyPlayer() {
    document.getElementById('player')?.style.setProperty('top', `${player.coordinates.y.value}px`)
    document.getElementById('player')?.style.setProperty('left', `${player.coordinates.x.value}px`)
  }



  return (
    <>
      <div className='h-full w-full z-0'>
        <div className='bg-black py-4'>
          <button className='bg-white' onClick={startGame}>Start</button>
          <button className='bg-white' onClick={flap}>Flap</button>
        </div>
        <div className='bg-red-200 h-[87vh]'>

        {generateObstacles()}
        {createPlayer()}

        </div>
        <div className='bg-black py-6'/>
      </div>
    </>
  )
}

export default App
