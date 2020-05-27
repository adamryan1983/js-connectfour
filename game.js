"use strict";

const state = {
  PLAYING: 'playing',
  REDWINS: 'redwins',
  YELLOWWINS: 'yellowwins',
  DRAW: 'draw',
  DROPPINGPIECE: 'droppingpiece',
}

let gameState = state.PLAYING;

const board = new Array(7);
let player = 1;

//map the images to their location
const boardImg = new Image();
boardImg.src = "/assets/c4Board.png";

const player1Img = new Image();
player1Img.src = "/assets/player1.png";
player1Img.classList = "fall";

const player2Img = new Image();
player2Img.src = "/assets/player2.png";
player2Img.classList = "fall";

const playAgain = new Image();
playAgain.src = "/assets/playAgain.png";

const player1Wins = new Image();
player1Wins.src = "/assets/redWins.png";

const player2Wins = new Image();
player2Wins.src = "/assets/yellowWins.png";

const blackBG = new Image();
blackBG.src = "/assets/BlackQuad.png";


let startPos = new Array(4);  //0 horizontal pixel position of start drop
                              //2 horizontal piece starts at, 3 vert position piece starts at
let endPos = new Array(4);    
let dropTimer;


//offset for images
const offsetPlayer1 = [10,8];
const offsetPlayer2 = [10,7];


const checkWin = (col, row, player) => {

  let offsets = new Array(4);
  offsets[0] = [0,1];   //vertical
  offsets[1] = [1,0];   //horizontal
  offsets[2] = [1,1];   //diagonal1
  offsets[3] = [-1,1];  //diagonal2

  for(let i = 0; i < 4; i++ ) {

    //check for win situations
    let columnCheck = col;
    let rowCheck = row;
    let count = 1;
    while (true) {
      rowCheck += offsets[i][1];
      columnCheck += offsets[i][0];   
      if (rowCheck<0 || columnCheck<0 || rowCheck>5 || columnCheck>6) {
        break;
      }
      if (board[columnCheck][rowCheck] === player) {
        count++;
      }
      else {
        break;
      }
    } 
    
    //reset rowCheck and columnCheck
    columnCheck = col;
    rowCheck = row;

    while (true) {
      rowCheck -= offsets[i][1];
      columnCheck -= offsets[i][0];   
      if (rowCheck<0 || columnCheck<0 || rowCheck>5 || columnCheck>6) {
        break;
      }
      if (board[columnCheck][rowCheck] === player) {
        count++;
      }
      else {
        break;
      }
    }

    if (count >= 4) {
      return player == 1 ? state.YELLOWWINS : state.REDWINS;
    }
  }

    let draw = true;
    for (let row = 0; row <= 6; row++) {
      for (let col = 0; col < 7; col++) {
          if (board[col][row] == 0) {
            draw = false;
          }
      }
    if (draw) {
      return state.DRAW;
    }
    else {
      return state.PLAYING;
    }
  }
}

for (let i = 0; i < 7; i++) {
    board[i] = new Array(6);
    board[i].fill(0);
}

const placePiece = (col) => {
  for (let row = 5; row >=0; row--) {
    if(board[col][row] == 0) {
      if(player === 1) {
        startPos = [col*100 + offsetPlayer1[0], offsetPlayer1[1],col,0];
        endPos = [col*100 + offsetPlayer1[0], row*100 + offsetPlayer1[1],col,row];
        // board[col][row] = 1;
        // checkWin(col,row,player);
        player = 2;
      }
      else {
        startPos = [col*100 + offsetPlayer2[0], offsetPlayer2[1],col,0];
        endPos = [col*100 + offsetPlayer2[0], row*100 + offsetPlayer2[1],col,row];
        // board[col][row] = 2;
        // checkWin(col,row,player);
        player = 1;
      }
      dropTimer = setInterval(dropPiece,16.67);
      gameState = state.DROPPINGPIECE;
      break;
    }
  }
  draw();
}

const dropPiece = () => {
  startPos[1] += 30;
  if (startPos[1] >= endPos[1]) {
    clearInterval(dropTimer);
    board[endPos[2]][endPos[3]] = player;
    gameState = checkWin(endPos[2],endPos[3],player);
    if( gameState === state.PLAYING && player === 2) {
      computerTurn();
    }
  }
  draw();
}

const draw = () => {
  const canvas = document.getElementById('tutorial');
  if (canvas.getContext) {
      let ctx = canvas.getContext('2d');
      ctx.clearRect(0,0,726,626);

      if (gameState === state.DROPPINGPIECE) {
        if (player === 1) {
          ctx.drawImage(player1Img,startPos[0],startPos[1])
        }
        else {
          ctx.drawImage(player2Img,startPos[0],startPos[1])
        }
      }


      ctx.drawImage(boardImg,0,0);
      for (let row = 0; row <= 6; row++) {
          for (let col = 0; col < 7; col++) {
              if (board[col][row] == 0) {
                //ctx.strokeRect(col*100, row*100, 100, 100);
              }
              else if (board[col][row] == 1) {
                ctx.drawImage(player1Img,col*100 + offsetPlayer1[0], row*100 + offsetPlayer1[1]);
              }
              else if (board[col][row] == 2) {
                ctx.drawImage(player2Img,col*100 + offsetPlayer2[0], row*100 + offsetPlayer2[1]);
              }
          }
      }
      for (let row = 0; row <= 6; row++) {
        for (let col = 0; col < 7; col++) {
          //ctx.strokeRect(col*100, row*100, 100, 100);
        }
      }

      if (gameState === state.REDWINS) {
        ctx.drawImage(blackBG, 0,0);
        ctx.drawImage(player1Wins, 200, 200);
        ctx.drawImage(playAgain,200,350);
        player = 1;
      }
      else if (gameState === state.YELLOWWINS) {
        ctx.drawImage(blackBG, 0,0);
        ctx.drawImage(player2Wins, 200, 200);
        ctx.drawImage(playAgain,200,350);
        player = 1;
      }
      else if (gameState === state.DRAW) {
        ctx.drawImage(blackBG, 0,0);
        ctx.drawImage(playAgain,200,350);
        player = 1;
      }
  }
};

const computerTurn = () => {
  // looks for a move which wins the game for the computer
  for (let col = 0; col < 7; col++) {
    for (let row = 5; row >= 0; row--) {
      if (board[col][row] === 0) {
        board[col][row] = 2;
        let gameStateAfterMove = checkWin(col,row, 1);
        board[col][row] = 0;
        if (gameStateAfterMove === state.YELLOWWINS) {
          console.log("Got you sucka!")
          placePiece(col);
          return
        }
        break;
      }
    }
  }

  // look for a move where the human can win the game
  for (let col = 0; col < 7; col++) {
    for (let row = 5; row >= 0; row--) {
      if (board[col][row] === 0) {
        board[col][row] = 1;
        let gameStateAfterMove = checkWin(col,row, 2);
        board[col][row] = 0;
        if (gameStateAfterMove === state.REDWINS) {
          console.log("i dont think so mr.")
          placePiece(col);
          return
        }
        break;
      }
    }
  }



  // want to make a random move
  let randomColumnOffset = parseInt(Math.random() * 7);
  for (let i = 0; i < 7; i++) {
    let col = i + randomColumnOffset;
    col = col % 7;
    for (let row = 5; row >= 0; row--) {
      if (board[col][row] === 0) {
        //place piece
        placePiece(col);
        return;
      }
    }
  }

}

const getMousePosition = (canvas, event) => { 
  let rect = canvas.getBoundingClientRect(); 
  let x = event.clientX - rect.left; 
  let y = event.clientY - rect.top; 

  if ( gameState === state.PLAYING && player === 1 ) {
    let col = parseInt(x / 100);
    placePiece(col);
  }

  else if (gameState != state.DROPPINGPIECE) {
    if (x >= 200 && x <=532 && y >= 350 && y <= 449) {
      gameState = state.PLAYING;
      for (let i = 0; i < 7; i++) {
        board[i].fill(0);
      }
      draw();
    }
  }
} 

window.onload = () => {
    draw();
    let canvasElem = document.getElementById("tutorial"); 
    canvasElem.addEventListener("mousedown", function(evt) { 
      getMousePosition(canvasElem, evt); 
    });
};