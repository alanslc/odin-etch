const INIT_NUM_GRID = 2;
const MAX_NUM_GRID = 100;
const MIN_NUM_GRID = 1;
const BOX_GAP = 2;
const PROMPT_MSG = `How many grids per side do you want? (${MIN_NUM_GRID} .. ${MAX_NUM_GRID})`;
const BOX_BGC = '2, 182, 122';
const REFRESH_INTERVAL = 100;
const TIME_TO_START_FADE = 3000;
const FADE_RATE = 0.01;

let boxesMap = new Map();
let curWinW, curWinH, curGridW, curGridH;
let isPainting = false;
let timeHandle;

prepare();
redraw(INIT_NUM_GRID);

function prepare() {
   const button = document.querySelector('.reset');
   button.addEventListener('click', reestGrid);
   window.addEventListener('resize', reportWindowResize);

   timeHandle = setInterval(refresh, REFRESH_INTERVAL);
}

function redraw(numGrid) {
   fitGridAreaToWindow();
   removeAllBox();
   addBoxesToGrid(numGrid);
}

function removeAllBox() {
   const grid = document.querySelector('.grid');
   const boxes = grid.querySelectorAll('.box');
   for (const box of boxes)
      grid.removeChild(box);
   boxesMap.clear();
}

function reestGrid() {
   const newSize = inputGridSize();
   if (newSize != null)
      redraw(newSize);
}

function inputGridSize() {
   let input, size;
   do {
      input = prompt(PROMPT_MSG);
      size = parseInt(input);
   } while (input != null && (isNaN(size) || size < MIN_NUM_GRID || size > MAX_NUM_GRID));

   return input == null ? null : size;
}

function refresh() {
   boxesMap.forEach(((info, box) => {
      const now = Date.now();

      if ((info.transparency > 0) && (now - info.timestamp > TIME_TO_START_FADE)) {
         info.transparency -= FADE_RATE;
         if (info.transparency < 0.001)
            info.transparency = 0;
         box.style.backgroundColor = `rgba(${BOX_BGC}, ${info.transparency.toFixed(2)})`
         // console.log('fadeing:', `rgba(${BOX_BGC}, ${info.transparency.toFixed(2)})`);
      }
   }));
}

function mouseEneterBox(e) {
   if (isPainting) {
      const box = e.target;
      box.style.backgroundColor = `rgb(${BOX_BGC})`

      const info = boxesMap.get(box);
      info.transparency = 1;
   }
}

function reportWindowResize(e) {
   fitGridAreaToWindow();
}

function addBoxesToGrid(n) {
   const g = n > MAX_NUM_GRID ? MAX_NUM_GRID : n < MIN_NUM_GRID ? MIN_NUM_GRID : n;

   const grid = document.querySelector('.grid');
   grid.style.gridTemplateColumns = `repeat(${n}, 1fr)`
   grid.style.gridTemplateRows = `repeat(${n}, 1fr)`

   for (let h = 0; h < g; h++) {
      for (let w = 0; w < g; w++) {
         const div = document.createElement('div');
         div.classList.add('box');
         div.addEventListener('mousedown', () => isPainting = true);
         div.addEventListener('mousemove', mouseEneterBox)
         div.addEventListener('mouseup', () => isPainting = false);
         grid.appendChild(div);

         const boxInfo = {
            timestamp: Date.now(),
            transparency: 0
         }
         boxesMap.set(div, boxInfo);
      }
   }
}

function fitGridAreaToWindow() {
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