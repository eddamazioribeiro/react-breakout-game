import React, {useEffect, useRef, useState} from 'react';

const Game = ({width, height, tilesize}) => {
  const gameScreen = useRef();
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
  });

  const init = () => {
    bindEvent('keydown', handleInput);

    let {x, y} = calculatePlayerInitialPosition(width, height);

    movePlayer(x, y);
  }

  const updateGame = () => {
    const context = gameScreen.current.getContext('2d');
    
    let {x, y} = calculatePlayerInitialPosition(width, height);
    
    context.clearRect(0, 0, width * tilesize, height * tilesize);
    context.fillStyle = 'DarkGreen';
    context.fillRect(player.xPos, player.yPos, player.width, player.height);
    
    bindEvent('keydown', handleInput);
  }
  
  const calculatePlayerInitialPosition = (screenWidth, screenHeight) => {
    let y = (screenHeight * tilesize) - tilesize;
    let x = (screenWidth * tilesize) / 2;

    x = x - (player.width / 2);

    return {x, y}
  }

  const handleInput = e => {
    e.preventDefault();

    let coord = undefined;

    switch (e.keyCode) {
      // left arrow
      case 37:
        coord = {x: -1, y: 0};
        break;
      // up arrow
      case 38:
        coord = {x: 0, y: -1};
        break;
      // right arrow
      case 39:
        coord = {x: 1, y: 0};
        break;
      // down arrow
      case 40:
        coord = {x: 0, y: 1};
        break;
      default:
        break;
    }

    if (coord !== undefined) {
      let {x, y} = coord;

      x = x * tilesize;
      y = y * tilesize;

      movePlayer(x, y);
    }
  }
  
  const bindEvent = (event, handleEvent) => {
    document.addEventListener(event, handleEvent);
  }

  const unbindEvent = (event, handleEvent) => {
    document.removeEventListener(event, handleEvent);
  }

  const movePlayer = (x, y) => {
    unbindEvent('keydown', handleInput)

    let newPlayer = {...player};

    newPlayer.xPos += x;
    newPlayer.yPos += y;
    
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