"use strict";

const state = {
  PLAYING: 'playing',
  REDWINS: 'redwins',
  YELLOWWINS: 'yellowwins',
  DRAW: 'draw',
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

//offset for images
const offsetPlayer1 = [14,10];
const offsetPlayer2 = [14,10];

const checkWin = (col, row, player) => {
  //check for vertical win
  let rowCheck = row;
  let count = 1;
  while (rowCheck > 0) {
    rowCheck--;
    if (board[col][rowCheck] === player) {
      count++;
    }
    else {
      break;
    }
  } 
   
  //reset rowCheck
  rowCheck = row;

  while (rowCheck < 5) {
    rowCheck++;
    if (board[col][rowCheck] == player) {
      count++;
    }
    else {
      break;
    }
  }

  if (count >= 4) {
    gameState = player == 1 ? state.YELLOWWINS : state.REDWINS;
  }
}

for (let i = 0; i < 7; i++) {
    board[i] = new Array(6);
    board[i].fill(0);
}

const placePiece = (col) => {
  for (let row = 5; row >=0; row--) {
    if(board[col][row] == 0) {
      if(player == 1) {
        board[col][row] = 1;
        checkWin(col,row,player);
        player = 2;
      }
      else {
        board[col][row] = 2;
        checkWin(col,row,player);
        player = 1;
      }
      break;
    }
  }
  draw();
  console.log(player2Img.className)
}

const slide = (col, row) => {

}

const draw = () => {
  const canvas = document.getElementById('tutorial');
  if (canvas.getContext) {
      let ctx = canvas.getContext('2d');
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
        ctx.drawImage(player1Wins, 200, 200);
        ctx.drawImage(playAgain,200,350);
      }
      else if (gameState === state.YELLOWWINS) {
        ctx.drawImage(player2Wins, 200, 200);
        ctx.drawImage(playAgain,200,350);
      }
  }
};

const getMousePosition = (canvas, event) => { 
  let rect = canvas.getBoundingClientRect(); 
  let x = event.clientX - rect.left; 
  let y = event.clientY - rect.top; 

  if ( gameState === state.PLAYING ) {
    let col = parseInt(x / 100);
    placePiece(col);
  }
  else {
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