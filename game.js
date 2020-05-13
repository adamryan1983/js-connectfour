"use strict";

const board = new Array(7);
let player = 1;

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
      for (let row = 0; row <= 6; row++) {
          for (let col = 0; col < 7; col++) {
              if (board[col][row] == 0) {
                ctx.strokeRect(col*100, row*100, 100, 100);
              }
              else if (board[col][row] == 1) {
                ctx.fillStyle = 'rgb(200, 0, 0)';
                ctx.fillRect(col*100, row*100, 100, 100);
              }
              else if (board[col][row] == 2) {
                ctx.fillStyle = 'rgb(200, 200, 0)';
                ctx.fillRect(col*100, row*100, 100, 100);
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