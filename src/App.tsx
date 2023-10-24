import './App.css'
import { useEffect, useState } from 'react';

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

  let opening = 300

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
      <div className=' p-1 absolute z-30' id='top-obstacle'>
        <div className=' p-1 absolute h-96 -translate-y-96 w-20 translate-x-1 z-30'/>
        <img className='z-40 h-96 -translate-y-80 absolute scale-125' src='../topObstacle.jpg'/>
      </div>

      <div className=' p-1 absolute z-30' id='bottom-obstacle'>
        <div className=' p-1 absolute h-96 translate-y-10 w-20 translate-x-1 z-30'/>
        <img className='z-50 absolute -rotate-90 translate-y-8 scale-150' src='https://frivannsliv.no/cdn/shop/articles/krabbe_91fc7f4f-d222-4d46-a2e2-1d5527b2d835.jpg?v=1643204382'/>
        <img className='z-40 absolute translate-y-20 h-96' src='../bottomObstacle.jpg'/>
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
      setGameIsRunning(false);
    }

    if (
      playerRightEdge >= topObstacleLeftEdge &&
      playerLeftEdge <= topObstacleRightEdge &&
      playerBottomEdge >= topObstacleTopEdge &&
      playerTopEdge <= topObstacleBottomEdge
    ) {
      setGameIsRunning(false);
    }

    if (playerBottomEdge >= player.coordinates.y.max || playerTopEdge <= player.coordinates.y.min) {
      setGameIsRunning(false);
    }

    if (playerTopEdge <= topObstacleBottomEdge && playerRightEdge >= topObstacleLeftEdge - 2 && playerRightEdge <= topObstacleLeftEdge + 2) {
      setGameIsRunning(false);
    }

    if (playerBottomEdge >= bottomObstacleTopEdge && playerRightEdge >= bottomObstacleLeftEdge - 2 && playerRightEdge <= bottomObstacleLeftEdge + 2) {
      setGameIsRunning(false);
    }
}

  let gravityValue = 1.1

  function flap() {

    animateFlapUp()

    return gravityValue = -6
  }

  function animateFlapUp() {
    const playerElement = document.getElementById('player');
    if (playerElement) {
      playerElement.style.setProperty('transform', 'rotate(-45deg)');
      playerElement.style.setProperty('transition', 'transform 0.2s ease-in-out');
      setTimeout(() => {
        playerElement.style.setProperty('transform', 'rotate(0deg)');
      }, 200);
    }
  }

  function animateFlapDown() {
    const playerElement = document.getElementById('player');
    if (playerElement) {
      const transform = playerElement.style.getPropertyValue('transform');
      if (!transform.includes('rotate') || transform.includes('rotate(0deg)') || transform.includes('rotate(45deg)')) {
        playerElement.style.setProperty('transform', 'rotate(45deg)');
        playerElement.style.setProperty('transition', 'transform 0.2s ease-in-out');
      }
    }
  }

  function gravity() {
    if (player.coordinates.y.value < player.coordinates.y.max) {

      if (gravityValue < 0) {
        gravityValue = gravityValue + 0.4
      } else if (gravityValue < 0.5) {
        gravityValue = gravityValue + 0.6
      }
      if (gravityValue < 4) {
      gravityValue = gravityValue * 1.06
      }
      
      player.coordinates.y.value += gravityValue
      if (gravityValue > 0) animateFlapDown()
      
    }
  }

  function startGame() {
    setGameIsRunning(true)
  }
  function createPlayer() {
    return (
      <>
        <div className='p-1 absolute rounded-full' id='player'>
          <img alt="Player" height={100} className="h-10" src='https://purepng.com/public/uploads/large/91508177304fwtqbi6ctvq3s7govin9kdhbopkgx6pm2tw9buwrhpiqjgygotyhs5dblx1tu7hnlc4ybfyrbkoebudhrtkjjfco08gx1ebrpncy.png'></img>
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
        return setPoints(prevPoints => prevPoints + 1);
      }
    }
  }

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function EndCard({ points }: { points: number }) {
    return (
      
        <div className=' bg-gray-900 absolute inset-0 flex justify-center gap-10'>
          <div className='flex flex-col justify-center items-center'>
            <h1 className='text-white text-4xl font-bold mb-4'>Game Over</h1>
            <h2 className='text-white text-2xl mb-4'>Final Score: {points}</h2>
            <button className='bg-white text-black py-2 px-4 rounded-md' onClick={() => {setPoints(0);startGame();}}>Play Again</button>
            <button className='bg-white text-black py-2 px-4 rounded-md mt-2' onClick={() => setSaveScreenShow(true)}>Save Score</button>
            {saveScreenShow ? <SaveScreen /> : null}
          </div>
        <div className='flex flex-col justify-center'>
          <Leaderboard />
        </div>
        <h1 className='text-white absolute text-xl'>The game must be played at 1536x739 resolution</h1>
        <h1 className='text-white absolute text-xl mt-6'>
          Your current resolution: {windowWidth}x{windowHeight}
          {windowWidth == 1536 && windowHeight == 739 ? 
          (<span className='bg-white px-1 rounded-md ml-4'>
            <svg className="inline h-6 fill-green-500 mb-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
            </svg>
          </span>) 
          :
          (<span className='bg-white px-1 rounded-md ml-4'>
            <svg className="inline h-6 fill-red-500 mb-2" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
            </svg>
          </span>)
          }
          </h1>
      
      </div>
    )
  }

  const [saveScreenShow, setSaveScreenShow] = useState(false);

  async function handleSave() {
    const response = await fetch('/api/saveScore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: name, score: points})
    })
    const fetchData = await response.json()
    console.log(fetchData)
    setSaveScreenShow(false)
  }

  const  [name, setName] = useState('');

function SaveScreen() {



  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md">
        <div className='relative'>
        <h2 className="text-lg font-medium mb-2">Your score: {points}</h2>
        <button onClick={() => setSaveScreenShow(false)} className="absolute top-0 right-0 p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        </div>
        <label className="block mb-2">Enter your initials</label>
        <input
          type="text"
          maxLength={3}
          placeholder='3 characters'
          value={name}
          onChange={(e) => {setName(e.target.value)}}
          className="border border-gray-300 rounded-md px-2 py-1 mb-2"
        />
        <button onClick={handleSave} className="bg-blue-500 text-white py-1 px-4 rounded-md ml-2">
          Save
        </button>
      </div>
    </div>
  );
}
  window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp') {
      flap();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') {
      setPoints(0);
      startGame();
    }
  });

  function Leaderboard() {

    const [data, setData] = useState<{ name: string, score: number }[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/getScores?amount=5');
      const data = await response.json();
      setData(data);
    }

    fetchData();
  }, []);

  if (data === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <h1 className='text-white text-4xl font-bold mb-4'>Leaderboard</h1>
        <div className='bg-white rounded-md p-4'>
          <div className='flex justify-between'>
          <span>Place</span>
          <span>Name</span>
          <span>Score</span>
          </div>
          {data.map((entry: { name: string, score: number }, index: number) => {
            return (
              <div key={index} className='flex justify-around items-center mb-2'>
                <span className='text-lg'>{index + 1}.</span>
                <span className='text-lg'>{entry.name}</span>
                <span className='text-lg'>{entry.score}</span>
              </div>
            )
          })}
          
        </div>
      </div>
  );
}




  useEffect(() => {
    if (gameIsRunning) {
      const game = setInterval(() => {
        if (!gameIsRunning) {
          clearInterval(game);
        }
        
        gravity();
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
        <div className='bg-red-200 h-[87vh] relative'>
        <h1 className='absolute right-0 text-5xl mr-4 mt-2 font-gameText z-50'>{points}</h1>
        <img className='z-0' src="https://cdn1.epicgames.com/ue/product/Screenshot/HighresScreenshot00018-1920x1080-455ada796d5505855b8de23264273e94.jpg?resize=1&w=1920" alt="" />
        

        {generateObstacles()}
        {createPlayer()}
        

        </div>
        <div className='bg-black py-6'/>
      </div>
      ) : 
      <EndCard points={points} />
      }
    </>
  )
}


