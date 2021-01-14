import React, {useEffect, useRef, useState} from 'react';

const Game = ({width, height, tilesize}) => {
  // vars
  const gameScreen = useRef();
  const [player, setPlayer] = useState({
    xPos: 60,
    yPos: 60
  });
  
  // hooks
  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    updateGame();
  });

  // functions
  const init = () => {
    handleInput();
  }

  const updateGame = () => {
    const context = gameScreen.current.getContext('2d');
    context.clearRect(0, 0, width * tilesize, height * tilesize);
    context.fillStyle = '';
    context.fillRect(player.xPos, player.yPos, 16, 16);
  }

  const handleKeys = e => {
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
  
      movePlayer(x, y);
    }
  }
  
  const handleInput = () => {
    document.addEventListener('keydown', handleKeys);
  }

  const movePlayer = (x, y) => {
    let newPlayer = {...player};

    newPlayer.xPos += x * tilesize;
    newPlayer.yPos += y * tilesize;

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