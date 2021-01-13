import React, {useEffect, useState} from 'react';

const Game = ({width, height, tilesize}) => {
  useEffect(() => {
    console.log('handle input');
    handleInput();
  });

  const handleKeys = e => {
    e.preventDefault();

    switch (e.keyCode) {
      // left arrow
      case 37:
        console.log('move left', {x: -1, y: 0});
        break;
      // up arrow
      case 38:
        console.log('move up', {x: 0, y: -1});
        break;
      // right arrow
      case 39:
        console.log('move right', {x: 1, y: 0});
        break;
      // down arrow
      case 40:
        console.log('move down', {x: 0, y: 1});
        break;
      default:
        break;
    }
  }
  
  const handleInput = () => {
    document.addEventListener('keydown', handleKeys);
  }
  
  return(
    <>
      <div>
        <canvas
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