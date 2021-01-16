import React, {useEffect, useRef, useState} from 'react';

const Game = ({width, height, tilesize}) => {
  const gameSpeed = 50;
  const gameScreen = useRef();
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [ball, setBall] = useState({
    width: tilesize,
    height: tilesize,
    xPos: tilesize,
    xDir: 1,
    yPos: tilesize,
    yDir: 1
  });
  const [player, setPlayer] = useState({
    width: tilesize * 5,
    height: tilesize,
    xPos: 0,
    yPos: 0
  });
  
  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    updateGame();
    bindEvent('keydown', handleInput);
  });

  useEffect(() => {
    moveBall(1 * tilesize, 1 * tilesize);
  }, [timer]);

  const init = () => {
    bindEvent('keydown', handleInput);

    let {x, y} = calculatePlayerInitialPosition(width, height);

    movePlayer(x, y);
  }

  const startTimer = (t) => {
    setInterval(() => {
      setTimer(t++);
    }, gameSpeed);
  }
 
  const updateGame = () => {
    if (gameStarted) {
      if (timer === 0) {
        let t = 0;
        startTimer(t);
      }

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

  const showTitleScreen = () => {
    const context = gameScreen.current.getContext('2d');
    
    context.clearRect(0, 0, width * tilesize, height * tilesize);
    
    context.fillStyle = 'black';
    context.font = 'bold 70px EarlyGameboy';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText('PONG', ((width * tilesize) / 2), ((height * tilesize) / 3));

    context.fillStyle = 'black';
    context.font = 'bold 19px EarlyGameboy';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText('PRESS ENTER', ((width * tilesize) / 2), ((height * tilesize) / 2));
  }

  const showPause = () => {
    const context = gameScreen.current.getContext('2d');

    context.fillStyle = 'black';
    context.font = 'bold 19px EarlyGameboy';
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

  const moveBall = (x, y) => {
    let newBall = {...ball};
    let screenXLimit = width * tilesize;
    let screenYLimit = height * tilesize;
    let newXPos = newBall.xPos + x;
    let newYPos = newBall.yPos + y;

    if (!gamePaused) {  
      if ((newXPos - newBall.width) <= 0 || ((newXPos) + newBall.width) > screenXLimit){
        newBall.xDir = ball.xDir * -1;
      }

      if ((newYPos - newBall.height) <= 0 || ((newYPos) + newBall.height) > screenYLimit){
        newBall.yDir = ball.yDir * -1;
      }      
  
      newBall.xPos += x * newBall.xDir;
      newBall.yPos += y * newBall.yDir;
    }
    
    setBall(newBall);
  }
  
  return(
    <>
      <div className="main">
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