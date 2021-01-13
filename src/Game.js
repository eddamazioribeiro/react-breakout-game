import React from 'react';

const Game = ({width, height, tilesize}) => {
  
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