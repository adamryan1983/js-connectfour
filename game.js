"use strict";

const board = new Array(7);
let player = 1;

const boardImg = new Image();
boardImg.src = "/assets/c4Board.png";
const player1Img = new Image();
player1Img.src = "/assets/player1.png";
const player2Img = new Image();
player2Img.src = "/assets/player2.png";

//offset for images
const offsetPlayer1 = [14,10];
const offsetPlayer2 = [14,10];

for (let i = 0; i < 7; i++) {
    board[i] = new Array(6);
    board[i].fill(0);
}

function placePiece(col) {
  for (let row = 5; row >=0; row--) {
    if(board[col][row] == 0) {
      if(player == 1) {
        board[col][row] = 1;
        player = 2;
      }
      else {
        board[col][row] = 2;
        player = 1;
      }
      break;
    }
  }
  draw();
}

function draw() {
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
          ctx.strokeRect(col*100, row*100, 100, 100);
        }
      }
  }
};

function getMousePosition(canvas, event) { 
  let rect = canvas.getBoundingClientRect(); 
  let x = event.clientX - rect.left; 
  let y = event.clientY - rect.top; 

  let col = parseInt(x / 100);
  placePiece(col);
  console.log(col);
} 

window.onload = () => {
    draw();
    let canvasElem = document.getElementById("tutorial"); 
    canvasElem.addEventListener("mousedown", function(evt) { 
      getMousePosition(canvasElem, evt); 
    });
};