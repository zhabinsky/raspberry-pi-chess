function Board () {
  this.figures = [
    ['b-4', 'b-2', 'b-3', 'b-6', 'b-5', 'b-3', 'b-2', 'b-4'],
    ['b-1', 'b-1', 'b-1', 'b-1', 'b-1', 'b-1', 'b-1', 'b-1'],
    ['0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0'],
    ['w-1', 'w-1', 'w-1', 'w-1', 'w-1', 'w-1', 'w-1', 'w-1'],
    ['w-4', 'w-2', 'w-3', 'w-6', 'w-5', 'w-3', 'w-2', 'w-4'],
  ];

  this.draw = () => {
    p5.fill (100);
    p5.noStroke ();
    renderFigures (this.figures);
  };
}

export default Board;

function renderFigures (figures) {
  const boardWidth = 8;
  const boardHeight = 8;
  const p = 0.3;
  for (let x = 0; x < boardWidth; x++) {
    for (let y = 0; y < boardHeight; y++) {
      const figure = figures[y][x];
      const img = images[figure];
      if (figure === '0') continue;
      if (img) p5.image (img, x + p, y + p, 1 - p * 2, 1 - p * 2);
      p5.text (figure, x + 2 * 0.1, y + 2 * 0.1);
    }
  }
}
