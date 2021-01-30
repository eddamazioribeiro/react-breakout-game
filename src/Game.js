import React, {useEffect, useRef, useState} from 'react';

const _map = [];

const Game = ({width, height, tilesize}) => {
  const gameSpeed = 150;
  const gameScreen = useRef();
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
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
    xDir: 0,
    yPos: 0
  });
  
  useEffect(() => {
    init();
  }, []);
  
  useEffect(() => {
    moveBall(1 * tilesize, 1 * tilesize);
  }, [timer]);

  useEffect(() => {
    updateGame();
    bindEvent('keydown', handleInput);
  }, [timer]);

  const init = () => {
    bindEvent('keydown', handleInput);

    createMap();

    let {x, y} = calculatePlayerInitialPosition(width, height);

    movePlayer(x, y);

    let t = 0;
    startTimer(t);
  }

  const createMap = () => {
    for (let i = 0; i <= width * tilesize; i++) {

      _map.push([]);

      for (let j = 0; j <= height * tilesize; j++) {
        let fill = false;

        // if ((j * tilesize >= 3 * tilesize && j * tilesize < (width - 3) * tilesize)
        // && (i * tilesize >= 2 * tilesize && i * tilesize < ((height / 2) - 2) * tilesize)) {
        if (
          // (j === 2 && i === 3)
          (j === 0 && i === 0)
          || (j === 1 && i === 1)
          || (j === 3 && i === 3)
          // || (j === 1 && i === 8)
          // || (j === 3 && i === 4)
          // || (j === 5 && i === 1)
          // || (j === 4 && i === 1)
          || (j === 2 && i === 14)
          || (j === 4 && i === 4)
          ) {
          fill = true;
        }

        _map[i].push({
          fill: fill,
          yPos: i * tilesize,
          xPos: j * tilesize
        });
      }
    }
  }

  const startTimer = (t) => {
    setInterval(() => {
      if (!gameOver) setTimer(t++);
    }, gameSpeed);
  }
 
  const updateGame = () => {
    if (gameStarted) {
      if (gameOver) {
        showGameOver();

        return;
      }

      if (!gamePaused) {
        const context = gameScreen.current.getContext('2d');
          
        context.clearRect(0, 0, width * tilesize, height * tilesize);
        context.fillStyle = 'black';

        for (let i = 0; i < width * tilesize; i++) {
          for (let j = 0; j < height * tilesize; j++) {
            let block = _map[i][j];

            if (block.fill) {
              context.fillRect(block.xPos, block.yPos, tilesize, tilesize);
            }
          }
        }
        
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

  const showGameOver = () => {
    const context = gameScreen.current.getContext('2d');

    context.fillStyle = 'black';
    context.font = 'bold 19px EarlyGameboy';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText('GAME OVER',
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
      case 39: // right arrow
        movePlayer(1 * tilesize, 0 * tilesize);
        keyPressed = true;
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
    
    newPlayer.xDir = (x > 0) ? 1 : -1;

    if (!gamePaused) {  
      if (newXPos < 0 || ((newXPos) + newPlayer.width) > screeLimit) {
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
    let newXPos = newBall.xPos + x;
    let newYPos = newBall.yPos + y;

    if (!gamePaused && gameStarted && !gameOver) {
      newBall = handleHitPlayer(newXPos, newYPos, newBall);
      newBall = handleHitWall(newXPos, newYPos, newBall);

      if (!ball.isDead) {
        // newBall = handleHitBlock(newXPos, newYPos, newBall);
      } else {
        setGameOver(true);

        return;
      }

      newBall.xPos += x * newBall.xDir;
      newBall.yPos += y * newBall.yDir;

      setBall(newBall);
    }
  }
  
  const handleHitPlayer = (newX, newY, newBall) => {
    let screenYLimit = height * tilesize;

    if ((newY >= screenYLimit - player.height)
      &&(newX >= player.xPos) && (newX <= player.xPos + player.width + tilesize)) {
      newBall.yDir = newBall.yDir * -1;
      newBall.xDir = newBall.yDir * (player.xDir !== 0) ? player.xDir : 1;
    }

    return newBall;
  }

  const handleHitWall = (newX, newY, newBall) => {
    let screenYLimit = height * tilesize;
    let screenXLimit = width * tilesize;

    // X axis bouncing
    if (newX - newBall.width <= 0 || newX >= screenXLimit) {
      newBall.xDir = newBall.xDir * -1;
    }

    // Y axis bouncing
    if (newY - newBall.height <= 0) {
      newBall.yDir = newBall.yDir * -1;
    }
    
    // hit the floor, GAME OVER
    if (newY === (screenYLimit - newBall.height) && newBall.yDir > 0) {
      newBall.isDead = true;
    }

    return newBall;
  }

  const handleHitBlock = (newX, newY, newBall) => {
    let loop = true;
    let hitBlock = false;

    for (let i = 0; i < width * tilesize; i++) {
      if (loop) {
        for (let j = 0; j < height * tilesize; j++) {
          let block = _map[i][j];
          
          if (block.fill) {
            // hit corner
            if (newX === block.xPos && newY === block.yPos) {
              newBall.xDir = ball.xDir * -1;
              newBall.yDir = ball.yDir * -1;


              console.log('hit corner');

              hitBlock = true;
            }

            if (hitBlock) {
              _map[i][j].fill = false;
              loop = false;
              break;
            }
          }
        }
      } else break;
    }

    return newBall;
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