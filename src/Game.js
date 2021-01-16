import React, {useEffect, useRef, useState} from 'react';

const Game = ({width, height, tilesize}) => {
  const gameScreen = useRef();
  const [ticker, setTicker] = useState();
  const [gameStarted, setGameStarted] = useState(true);
  const [gamePaused, setGamePaused] = useState(false);
  const [ball, setBall] = useState({
    width: tilesize,
    height: tilesize,
    xPos: 0,
    yPos: 0
  });
  const [player, setPlayer] = useState({
    width: tilesize * 5,
    height: tilesize,
    xPos: 0,
    yPos: 0
  });
  
  useEffect(() => {
    init();

    let tic = true;

    setInterval(() => {
      if (tic)
        console.log('tic');
      else
        console.log('toc');
      
      tic = !tic;

      let {xPos, yPos} = ball;

      moveBall((xPos + 1) * tilesize, (yPos + 1) * tilesize);
    }, 1000);
  }, []);

  useEffect(() => {
    console.log('refreshBall')
  }, [ball]);

  useEffect(() => {
    console.log('refreshGame')

    updateGame();
    bindEvent('keydown', handleInput);
  });

  const init = () => {
    bindEvent('keydown', handleInput);

    let {x, y} = calculatePlayerInitialPosition(width, height);

    movePlayer(x, y);
  }

  const moveBall = (x, y) => {
    let newBall = {...ball};
    
    if (!gamePaused) {
      newBall.xPos += x;
      newBall.yPos += y; 
    }
    
    setBall(newBall);
  }

  const showTitleScreen = () => {
    const context = gameScreen.current.getContext('2d');
    
    context.clearRect(0, 0, width * tilesize, height * tilesize);
    
    context.fillStyle = 'black';
    context.font = 'bold 70px Arial';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText('PONG', ((width * tilesize) / 2), ((height * tilesize) / 3));

    context.fillStyle = 'black';
    context.font = 'bold 19px Arial';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText('PRESS ENTER', ((width * tilesize) / 2), ((height * tilesize) / 2));
  }

  const showPause = () => {
    const context = gameScreen.current.getContext('2d');

    context.fillStyle = 'black';
    context.font = 'bold 19px Arial';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText('PAUSE',
      ((width * tilesize) / 2),
      ((height * tilesize) / 2) + 20
      );
  }  

  const pauseGame = (pause) => {
    setGamePaused(pause);
  }

  const updateGame = () => {
    console.log('refreshAll');
    if (gameStarted) {
      if (!gamePaused) {
        const context = gameScreen.current.getContext('2d');
  
        context.clearRect(0, 0, width * tilesize, height * tilesize);
        context.fillStyle = 'black';
        context.fillRect(player.xPos, player.yPos, player.width, player.height);
        context.fillRect(ball.xPos, ball.yPos, ball.width, ball.height);
      } else {
        showPause();
      }
    } else {
      showTitleScreen();
    }
  }
  
  const calculatePlayerInitialPosition = (screenWidth, screenHeight) => {
    let y = (screenHeight * tilesize) - tilesize;
    let x = (screenWidth * tilesize) / 2;

    x = x - (player.width / 2);

    return {x, y}
  }

  const handleEnterKey = () => {
    if (!gameStarted) {
      setGameStarted(true);
    } else {
      pauseGame(!gamePaused);
    }
  }

  const handleInput = e => {
    e.preventDefault();

    let keyPressed = false;

    switch (e.keyCode) {
      case 13: // enter
        handleEnterKey();
        keyPressed = true;
        break;
      case 37: // left arrow
        movePlayer(-1 * tilesize, 0 * tilesize);
        keyPressed = true;
        break;
      case 38: // up arrow
        // movePlayer(0 * tilesize, -1 * tilesize);
        // keyPressed = true;
        break;
      case 39: // right arrow
        movePlayer(1 * tilesize, 0 * tilesize);
        keyPressed = true;
        break;
      case 40: // down arrow
        // movePlayer(0 * tilesize, 1 * tilesize);
        // keyPressed = true;
        break;
      default:
        break;
    }

    if (keyPressed) unbindEvent('keydown', handleInput);
  }
  
  const bindEvent = (event, handleEvent) => {
    document.addEventListener(event, handleEvent);
  }

  const unbindEvent = (event, handleEvent) => {
    document.removeEventListener(event, handleEvent);
  }

  const movePlayer = (x, y) => {
    let newPlayer = {...player};
    let screeLimit = width * tilesize;
    let newXPos = newPlayer.xPos + x;
    
    if (!gamePaused) {  
      if (newXPos < 0 || ((newXPos) + newPlayer.width) > screeLimit){
        newPlayer.xPos = player.xPos;
        newPlayer.yPos = player.yPos;
      } else {
        newPlayer.xPos += x;
        newPlayer.yPos += y;
      }  
    }
    
    setPlayer(newPlayer);
  }
  
  return(
    <>
      <div>
        <canvas
          ref={gameScreen}
          width={width * tilesize}
          height={height * tilesize}
          style={{
            border: '1px solid black',
            background: 'DimGrey'}}>
        </canvas>
      </div>
    </>
  );
}

export default Game;