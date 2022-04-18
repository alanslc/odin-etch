const INIT_NUM_GRID = 16;
const MAX_NUM_GRID = 100;
const MIN_NUM_GRID = 1;
const BOX_GAP = 2;

let numGrid = INIT_NUM_GRID;
let curWinW, curWinH, curGridW, curGridH;


window.addEventListener('resize', reportWindowResize);
calGridArea();
addBoxesToGrid(numGrid);

function reportWindowResize(e) {
   calGridArea();
}

function addBoxesToGrid(n) {
   const grid = document.querySelector('.grid');

   const g = n > MAX_NUM_GRID ? MAX_NUM_GRID : n < MIN_NUM_GRID ? MIN_NUM_GRID : n;

   for (let h = 0; h < g; h++) {
      for (let w = 0; w < g; w++) {
         const div = document.createElement('div');
         div.classList.add('box');
         grid.appendChild(div);
      }
   }
}

function calGridArea() {
   curWinW = window.innerWidth;
   curWinH = window.innerHeight;

   let style, gridWidth, gridHeight, side;

   const body = document.querySelector('body');
   style = window.getComputedStyle(body);
   const bodyPaddingLeft = toPixel(style.paddingLeft);
   const bodyPaddingRight = toPixel(style.paddingRight);
   const bodyPaddingTop = toPixel(style.paddingTop);
   const bodyPaddingBottom = toPixel(style.paddingBottom);

   const button = document.querySelector('.reset');
   style = window.getComputedStyle(button);
   const buttonHeight = toPixel(style.height);
   const buttonMarginTop = toPixel(style.marginTop);
   const buttonMarginBottom = toPixel(style.marginBottom);

   gridWidth = curWinW - bodyPaddingLeft - bodyPaddingRight;
   gridHeight = curWinH - bodyPaddingTop - bodyPaddingBottom - buttonHeight - buttonMarginTop - buttonMarginBottom;

   const grid = document.querySelector('.grid');
   style = window.getComputedStyle(grid);
   if (gridWidth < gridHeight) {
      grid.style.height = gridWidth + 'px';
      grid.style.width = gridWidth + 'px';
      curGridW = curGridH = gridWidth;
   }
   else {
      grid.style.height = gridHeight + 'px';
      grid.style.width = gridHeight + 'px';
      curGridW = curGridH = gridHeight;
   }
}

function toPixel(s) {
   if (s.endsWith('px'))
      return Math.floor(Number(s.substring(0, s.length - 2)));
}