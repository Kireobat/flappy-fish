import './App.css'
import React, { useEffect, useState } from 'react';

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

export function App() {

  const [points, setPoints] = useState(0);

  let opening = 210

  const [gameIsRunning, setGameIsRunning] = useState(Boolean)

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

  let bottomObstacle: obstacleInterface = {
    coordinates: {
      x: {
        value: 0,
        min: 750,
        max: 1536
      },
      y: {
        value: 0,
        min: 275,
        max: 600
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

    
    while (coordX < bottomObstacle.coordinates.x.min) {coordX = Math.floor(Math.random() * topObstacle.coordinates.x.max)}

    while (bottomY < bottomObstacle.coordinates.y.min) {bottomY = Math.floor(Math.random() * bottomObstacle.coordinates.y.max)}

    topY = bottomY - opening

    // apply changes to obstacles

    bottomObstacle.coordinates.x.value = coordX
    bottomObstacle.coordinates.y.value = bottomY
    bottomObstacle.hitbox.height = 100
    bottomObstacle.hitbox.width = 100
    bottomObstacle.speed = 2

    topObstacle.coordinates.x.value = coordX
    topObstacle.coordinates.y.value = topY
    topObstacle.hitbox.height = 100
    topObstacle.hitbox.width = 100
    topObstacle.speed = 2

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

    // check if obstacles have traveled past the left side of the screen and give them a new random y coordinate
    if (bottomObstacle.coordinates.x.value < 0 || topObstacle.coordinates.x.value < 0) {

      let bottomY = -1

      while (bottomY < bottomObstacle.coordinates.y.min) {bottomY = Math.floor(Math.random() * bottomObstacle.coordinates.y.max)}
      let topY = bottomY - opening

      bottomObstacle.coordinates.x.value = bottomObstacle.coordinates.x.max
      bottomObstacle.coordinates.y.value = bottomY

      topObstacle.coordinates.x.value = topObstacle.coordinates.x.max
      topObstacle.coordinates.y.value = topY
    }

    
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
    const playerLeftEdge = player.coordinates.x.value - 45;
const playerRightEdge = player.coordinates.x.value + player.hitbox.width + 45;
const playerTopEdge = player.coordinates.y.value;
const playerBottomEdge = player.coordinates.y.value + player.hitbox.height;

const bottomObstacleLeftEdge = bottomObstacle.coordinates.x.value;
const bottomObstacleRightEdge = bottomObstacle.coordinates.x.value + bottomObstacle.hitbox.width;
const bottomObstacleTopEdge = bottomObstacle.coordinates.y.value;
const bottomObstacleBottomEdge = bottomObstacle.coordinates.y.value + bottomObstacle.hitbox.height;

const topObstacleLeftEdge = topObstacle.coordinates.x.value;
const topObstacleRightEdge = topObstacle.coordinates.x.value + topObstacle.hitbox.width;
const topObstacleTopEdge = topObstacle.coordinates.y.value;
const topObstacleBottomEdge = topObstacle.coordinates.y.value + topObstacle.hitbox.height;

if (
  playerRightEdge >= bottomObstacleLeftEdge &&
  playerLeftEdge <= bottomObstacleRightEdge &&
  playerBottomEdge >= bottomObstacleTopEdge &&
  playerTopEdge <= bottomObstacleBottomEdge
) {
  setGameIsRunning(false)
}

if (
  playerRightEdge >= topObstacleLeftEdge &&
  playerLeftEdge <= topObstacleRightEdge &&
  playerBottomEdge >= topObstacleTopEdge &&
  playerTopEdge <= topObstacleBottomEdge
) {
  setGameIsRunning(false)
}
  }

  let gravityValue = 1.1

  function flap() {
    return gravityValue = -6
  }

  function gravity() {
    if (player.coordinates.y.value < player.coordinates.y.max) {

      if (gravityValue < 0) {
        gravityValue = gravityValue + 0.5
      } else if (gravityValue < 0.5) {
        gravityValue = gravityValue + 0.1
      }
      if (gravityValue < 4) {
      gravityValue = gravityValue * 1.06
      }
      
      
      player.coordinates.y.value += gravityValue
    }
  }

  let enableGravity = true

  function gameProcess() {
    console.log("gameIsRunning: "+gameIsRunning)
      let game: any = setInterval(() => {
        if (!gameIsRunning) {
          alert('game over')
          return clearInterval(game)
        }
        if (enableGravity) {
          gravity()
        }
        enableGravity = !enableGravity
        
        addScore()
        checkForCollision()
        modifyObstacles()
        modifyPlayer()
      }, 5)
  }

  function startGame() {
    setGameIsRunning(true)
    //gameProcess()
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

  function addScore() {

    if(player.coordinates.y.value > topObstacle.coordinates.y.value && player.coordinates.y.value < bottomObstacle.coordinates.y.value){
      if (player.coordinates.x.value + 2 > bottomObstacle.coordinates.x.value && player.coordinates.x.value - 1 < bottomObstacle.coordinates.x.value  ) {
        setPoints(prevPoints => prevPoints + 1);
      }
    }
  }

  const createPlayerName = async() => {
    const response = await fetch('/api/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: 'aaa'})
    })
    const fetchData = await response.json()
    console.log(fetchData)
  }

  function EndCard({ points }: { points: number }) {
    return (
      <div className='absolute inset-0 bg-gray-900 flex flex-col justify-center items-center'>
        <h1 className='text-white text-4xl font-bold mb-4'>Game Over</h1>
        <h2 className='text-white text-2xl mb-4'>Final Score: {points}</h2>
        <button className='bg-white text-black py-2 px-4 rounded-md' onClick={() => {setPoints(0);startGame();}}>Play Again</button>
      </div>
    )
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        flap()
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount


  useEffect(() => {
    if (gameIsRunning) {
      const game = setInterval(() => {
        if (!gameIsRunning) {
          alert('game over');
          clearInterval(game);
        }
        if (enableGravity) {
          gravity();
        }
        enableGravity = !enableGravity;
        
        addScore();
        checkForCollision();
        modifyObstacles();
        modifyPlayer();
      }, 5);
  
      // Cleanup function to clear the interval when gameIsRunning changes
      return () => clearInterval(game);
    }
  }, [gameIsRunning]); // This effect runs whenever gameIsRunning changes

  return (
    <>

    {gameIsRunning ? (
      <div className='h-full w-full z-0'>
        <div className='bg-black py-4'>
          <button className='bg-white' onClick={startGame}>Start</button>
          <button className='bg-white' onClick={flap}>Flap</button>
          <h1 className='text-white'>Score: {points}</h1>
        </div>
        <div className='bg-red-200 h-[87vh]'>

        {generateObstacles()}
        {createPlayer()}
        

        </div>
        <div className='bg-black py-6'/>
      </div>
      ) : <EndCard points={points} />}
    </>
  )
}


