import React, {useEffect, useRef, useState} from 'react';

var _map = {
  blockCount: 0,
  data: [[]]
}
var _score = 0;
var _highScore = 0;
var _keyState = {};
var _ticker = null;
var _level = 0;

const Game = ({width, height, tilesize}) => {
  let _iniX = ((width * tilesize) / 2) - ((tilesize * 5) / 2);
  let _iniY = (height * tilesize) - tilesize;

  const gameSpeed = 100;
  const gameScreen = useRef();
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [ball, setBall] = useState({
    width: tilesize,
    height: tilesize,
    xPos: 0,
    xDir: 0,
    yPos: 0,
    yDir: 0
  });
  const [player, setPlayer] = useState({
    color: 'red',
    width: tilesize * 5,
    height: tilesize,
    xPos: _iniX,
    xDir: 0,
    yPos: _iniY - (_level * tilesize)
  });

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    moveBall(1 * tilesize, 1 * tilesize);
  }, [timer]);

  useEffect(() => {
    updateGame();
  }, [timer]);

  const init = () => {
    bindEvent('keyup', handleKeyUp);
    bindEvent('keydown', handleKeyDown);

    _score = 0;
    _iniY -= (_level * tilesize);

    createMap();

    clearPlayer(_iniX, _iniY);
    clearBall(_iniX, _iniY);

    let t = 0;
    startTimer(t);
  }

  const clearPlayer = (x, y) => {
    let newPlayer = {...player};

    newPlayer.xPos = x;
    newPlayer.yPos = y;
    newPlayer.xDir = 0;
    newPlayer.yDir = 0;

    setPlayer(newPlayer);
  }

  const clearBall = (x, y) => {
    let newBall = {...ball};

    newBall.xPos = x;
    newBall.yPos = y - (2 * tilesize);
    newBall.xDir = -1;
    newBall.yDir = -1;
    newBall.isDead = false;

    setBall(newBall);
  }

  const createMap = () => {
    _map.data = [[]];

    for (let i = 0; i <= width * tilesize; i++) {

      _map.data.push([]);

      for (let j = 0; j <= height * tilesize; j++) {
        let fill = false;

        if ((j * tilesize >= 3 * tilesize && j * tilesize < (width - 3) * tilesize)
        && (i * tilesize >= 2 * tilesize && i * tilesize < ((height / 2) - 2) * tilesize)) {
          fill = Math.round(Math.random());
          _map.blockCount += 1;
        }

        _map.data[i].push({
          fill: fill,
          yPos: i * tilesize,
          xPos: j * tilesize
        });
      }
    }
  }

  const startTimer = (t) => {
    _ticker = setInterval(() => {
      setTimer(t++);
    }, gameSpeed);
  }

  const updateGame = () => {
    handleInput();

    if (gameStarted) {
      if (gameOver) {
        handleGameOver();

        return;
      }

      if (!gamePaused) {
        const context = gameScreen.current.getContext('2d');

        context.clearRect(0, 0, width * tilesize, height * tilesize);
        context.fillStyle = 'black';

        for (let i = 0; i < width * tilesize; i++) {
          for (let j = 0; j < height * tilesize; j++) {
            let block = _map.data[i][j];

            if (block && block.fill) {
              context.fillRect(block.xPos, block.yPos, tilesize, tilesize);
            }
          }
        }

        context.fillRect(player.xPos, player.yPos, player.width, player.height);
        context.fillStyle = player.color;
        context.fillRect(ball.xPos, ball.yPos, ball.width, ball.height);

        showScore(context, _score);
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
    context.font = 'bold 24px EarlyGameboy';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText('THIS IS A',
        ((width * tilesize) / 2),
        ((height * tilesize) / 4.4)
      );

    context.fillStyle = 'black';
    context.font = 'bold 42px EarlyGameboy';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText('BREAK',
        ((width * tilesize) / 2),
        ((height * tilesize) / 3)
      );

    context.fillStyle = 'black';
    context.font = 'bold 50px EarlyGameboy';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText('OUT.',
      ((width * tilesize) / 2) + tilesize,
      ((height * tilesize) / 2.3)
    );

    let blink = (timer % 6 == 0) ? false : true;

    showHighScore(context, blink, _highScore);

    if (blink) {
      context.fillStyle = 'black';
      context.font = 'bold 17px EarlyGameboy';
      context.textBaseline = 'middle';
      context.textAlign = 'center';
      context.fillText('PRESS', ((width * tilesize) / 2), ((height * tilesize) / 1.7));
      context.fillText('ENTER', ((width * tilesize) / 2), ((height * tilesize) / 1.6));
    }

    context.fillStyle = 'black';
    context.font = 'bold 11px EarlyGameboy';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText('made with react',
        ((width * tilesize) / 2),
        ((height * tilesize) - tilesize / 2)
      );
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

  const setHighScore = (currScore) => {
    if (currScore > _highScore) _highScore = currScore;
  }

  const showScore = (context, score) => {
    let strScore = returnScoreToPrint(score);

    context.fillStyle = 'black';
    context.font = 'bold 13px EarlyGameboy';
    context.textBaseline = 'left';
    context.textAlign = 'left';
    context.fillText('SCORE  ',
        ((width * tilesize) / 2),
        tilesize / 2
      );
    context.textBaseline = 'left';
    context.textAlign = 'right';
    context.fillText(strScore,
        ((width * tilesize)) - (tilesize / 2),
        tilesize / 2
      );
  }

  const showHighScore = (context, blink, _highScore) => {
    let strScore = returnScoreToPrint(_highScore);

    context.fillStyle = 'black';
    context.font = 'bold 13px EarlyGameboy';
    context.textBaseline = 'left';
    context.textAlign = 'left';
    context.fillText('HIGH-SCORE  ',
        ((width * tilesize) / 3.2),
        tilesize / 2
      );

    if (blink) {
      context.textBaseline = 'left';
      context.textAlign = 'right';
      context.fillText(strScore,
          ((width * tilesize)) - (tilesize / 2),
          tilesize / 2
        );
    }
  }

  const returnScoreToPrint = (score) => {
    let scoreAux = score.toString().split('');
    let length = scoreAux.length;

    if (length <= 7) {
      let zerosQty = 7 - length;

      for(let i = 0; i < zerosQty; i++) {
        scoreAux.unshift('0');
      }
    }

    return scoreAux.join('');
  }

  const showGameOver = () => {
    const context = gameScreen.current.getContext('2d');

    context.fillStyle = 'black';
    context.font = 'bold 19px EarlyGameboy';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText('YOU LOSE.',
        ((width * tilesize) / 2),
        ((height * tilesize) / 2) + 20
      );
  }

  const showLevel = () => {
    const context = gameScreen.current.getContext('2d');

    context.fillStyle = 'black';
    context.font = 'bold 19px EarlyGameboy';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText('LEVEL ' + _level,
        ((width * tilesize) / 2),
        ((height * tilesize) / 2) + 20
      );
  }

  const handleGameOver = () => {
    setHighScore(_score);

    showGameOver();

    clearInterval(_ticker);

    setTimeout(() => {
      setGameOver(false);
      setGamePaused(false);
      setGameStarted(false);

      init();
    }, 1000);
  }
 
  const pauseGame = (pause) => {
    setGamePaused(pause);
  }

  const addPointsToScore = (points) => {
    _score += points;

    return _score;
  }

  const handleEnterKey = () => {
    if (!gameStarted) {
      setGameStarted(true);
    } else {
      pauseGame(!gamePaused);
    }
  }

  const handleInput = () => {
    let x = 0, y = 0;

    // enter
    if (_keyState[13]) {
      handleEnterKey();
    }
    // left arrow
    if (_keyState[37]) {
      x += -1;
      y += 0;
    }
    // right arrow
    if (_keyState[39]) {
      x += 1;
      y += 0;
    }

    movePlayer(x * tilesize, y * tilesize);
  };

  const handleKeyDown = e => {
    _keyState[e.keyCode || e.which] = true;
  }

  const handleKeyUp = e => {
    _keyState[e.keyCode || e.which] = false;
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

    if (!gamePaused && gameStarted) {
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
        newBall = handleHitBlock(newXPos, newYPos, newBall);
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
    if ((newY === player.yPos)
      && (newX >= player.xPos) && (newX <= player.xPos + player.width + tilesize)) {
      newBall.yDir = newBall.yDir * -1;

      const newXDir = () => {
        if (_keyState[37]) return -1;
        else if (_keyState[39]) return 1
        else return (newBall.xDir);
      }

      newBall.xDir = newXDir();
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
    if ((newY === (screenYLimit - newBall.height))
      && newBall.yDir > 0) {
      newBall.isDead = true;
    }

    return newBall;
  }

  const handleHitBlock = (newX, newY, newBall) => {
    var block, blockAux = null;
    let x = null;
    let y = null;

    // hit left-bottom face
    x = ((newX / tilesize));
    y = ((newY / tilesize) - 1);

    block = _map.data[y][x];

    x = ((newX / tilesize) - 1);
    y = (((newY / tilesize) - 2)) >= 0 ? (((newY / tilesize) - 2)) : 0;

    blockAux = _map.data[y][x];

    if ((block && block.fill) && (blockAux && blockAux.fill)) {
      _map.blockCount -= 2;
      block.fill = false;
      blockAux.fill = false;
      newBall.xDir = ball.xDir * -1;
      newBall.yDir = ball.yDir * -1;

      addPointsToScore(20);

      return newBall;
    }

    // hit bottom-right face
    x = (((newX / tilesize) - 2)) >= 0 ? (((newX / tilesize) - 2)) : 0;
    y = ((newY / tilesize) - 1);

    block = _map.data[y][x];

    x = ((newX / tilesize) - 1);
    y = (((newY / tilesize) - 2)) >= 0 ? (((newY / tilesize) - 2)) : 0;

    blockAux = _map.data[y][x];

    if ((block && block.fill) && (blockAux && blockAux.fill)) {
      _map.blockCount -= 2;
      block.fill = false;
      blockAux.fill = false;
      newBall.yDir = ball.yDir * -1;
      newBall.xDir = ball.xDir * -1;

      addPointsToScore(20);

      return newBall;
    }

    // hit right-top face
    x = (((newX / tilesize) - 2)) >= 0 ? (((newX / tilesize) - 2)) : 0;
    y = ((newY / tilesize) - 1);

    block = _map.data[y][x];

    x = ((newX / tilesize) - 1);
    y = ((newY / tilesize));

    blockAux = _map.data[y][x];

    if ((block && block.fill) && (blockAux && blockAux.fill)) {
      _map.blockCount -= 2;
      block.fill = false;
      blockAux.fill = false;
      newBall.yDir = ball.yDir * -1;
      newBall.xDir = ball.xDir * -1;

      addPointsToScore(20);

      return newBall;
    }

    // hit top-left face
    x = ((newX / tilesize) - 1);
    y = ((newY / tilesize));

    block = _map.data[y][x];

    x = ((newX / tilesize));
    y = ((newY / tilesize) - 1);

    blockAux = _map.data[y][x];

    if ((block && block.fill) && (blockAux && blockAux.fill)) {
      _map.blockCount -= 2;
      block.fill = false;
      blockAux.fill = false;
      newBall.yDir = ball.yDir * -1;
      newBall.xDir = ball.xDir * -1;

      addPointsToScore(20);

      return newBall;
    }

    // hit left face
    x = ((newX / tilesize));
    y = ((newY / tilesize) - 1);

    block = _map.data[y][x];

    if (block && block.fill) {
      _map.blockCount -= 1;
      block.fill = false;
      newBall.xDir = ball.xDir * -1;

      addPointsToScore(10);

      return newBall;
    }

    // hit right face
    x = (((newX / tilesize) - 2)) >= 0 ? (((newX / tilesize) - 2)) : 0;
    y = ((newY / tilesize) - 1);

    block = _map.data[y][x];

    if (block && block.fill) {
      _map.blockCount -= 1;
      block.fill = false;
      newBall.xDir = ball.xDir * -1;

      addPointsToScore(10);

      return newBall;
    }

    // hit top face
    x = ((newX / tilesize) - 1);
    y = ((newY / tilesize));

    block = _map.data[y][x];

    if (block && block.fill) {
      _map.blockCount -= 1;
      block.fill = false;
      newBall.yDir = ball.yDir * -1;

      addPointsToScore(10);

      return newBall;
    }

    // hit bottom face
    x = ((newX / tilesize) - 1);
    y = (((newY / tilesize) - 2)) >= 0 ? (((newY / tilesize) - 2)) : 0;

    block = _map.data[y][x];

    if (block && block.fill) {
      _map.blockCount -= 1;
      block.fill = false;
      newBall.yDir = ball.yDir * -1;

      addPointsToScore(10);

      return newBall;
    }

    // hit corner
    x = ((newX / tilesize) - 1) + newBall.xDir;
    y = ((newY / tilesize) - 1) + newBall.yDir;

    block = _map.data[y][x];

    if (block && block.fill) {
      _map.blockCount -= 1;
      block.fill = false;

      newBall.xDir = ball.xDir * -1;
      newBall.yDir = ball.yDir * -1;

      addPointsToScore(10);

      return newBall;
    }

    return newBall;
  }

  return(
    <>
      <div className="game-area">
        <canvas
          ref={gameScreen}
          width={width * tilesize}
          height={height * tilesize}
          style={{
            border: '1px solid black',
            background: 'DimGrey'}}>
        </canvas>
      </div>
      <div className="contact">
        <div className="row">
          <span>
            <a href="https://www.linkedin.com/in/eduardo-damazio-ribeiro/"
              target="_blank">
            <i className="icon fa fa-linkedin-square" style={{fontSize: '22px'}}></i>&nbsp;
              Eduardo Ribeiro
            </a>
          </span>
        </div>
        <div className="row">
          <span>
            <a href="https://github.com/eddamazioribeiro/react-breakout-game"
              target="_blank">
            <i className="icon fa fa-git-square" style={{fontSize: '22px'}}></i>&nbsp;
              /react-breakout-game
            </a>
          </span>
        </div>
      </div>
    </>
  );
}

export default Game;