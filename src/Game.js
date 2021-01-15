import React, {useEffect, useRef, useState} from 'react';

const Game = ({width, height, tilesize}) => {
  const gameScreen = useRef();
  const [gameStarted, setGameStarted] = useState(true);
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

  const init = () => {
    bindEvent('keydown', handleInput);

    let {x, y} = calculatePlayerInitialPosition(width, height);

    movePlayer(x, y);
  }

  const showTitleScreen = () => {
    const context = gameScreen.current.getContext('2d');
    
    context.clearRect(0, 0, width * tilesize, height * tilesize);
    
    context.fillStyle = 'DarkGreen';
    context.font = 'bold 70px Arial';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText('PONG', ((width * tilesize) / 2), ((height * tilesize) / 3));

    context.fillStyle = 'DarkGreen';
    context.font = 'bold 19px Arial';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText('PRESS ENTER', ((width * tilesize) / 2), ((height * tilesize) / 2));
  }

  const updateGame = () => {
    if (gameStarted) {
      const context = gameScreen.current.getContext('2d');

      context.clearRect(0, 0, width * tilesize, height * tilesize);
      context.fillStyle = 'DarkGreen';
      context.fillRect(player.xPos, player.yPos, player.width, player.height);
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

  const handleInput = e => {
    e.preventDefault();

    let keyPressed = false;

    switch (e.keyCode) {
      case 13: // enter
        setGameStarted(true);
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

    if (newXPos < 0 || ((newXPos) + newPlayer.width) > screeLimit){
      newPlayer.xPos = player.xPos;
      newPlayer.yPos = player.yPos;
    } else {
      newPlayer.xPos += x;
      newPlayer.yPos += y;
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