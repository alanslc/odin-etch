const INIT_NUM_GRID = 16;

let numGrid = INIT_NUM_GRID;

window.addEventListener('resize', reportWindowResize);
calGridArea();

function reportWindowResize(e) {
   calGridArea();
}

function calGridArea() {
   winW = window.innerWidth;
   winH = window.innerHeight;

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

   gridHeight = winH - bodyPaddingTop - bodyPaddingBottom - buttonHeight - buttonMarginTop - buttonMarginBottom;
   gridWidth = winW - bodyPaddingLeft - bodyPaddingRight;

   const grid = document.querySelector('.grid');
   style = window.getComputedStyle(grid);
   if (gridWidth < gridHeight) {
      grid.style.height = gridWidth + 'px';
      grid.style.width = gridWidth + 'px';
   }
   else {
      grid.style.height = gridHeight + 'px';
      grid.style.width = gridHeight + 'px';
   }
}

function toPixel(s) {
   if (s.endsWith('px'))
      return Math.floor(Number(s.substring(0, s.length - 2)));
}