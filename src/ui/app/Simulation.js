import {getIntersection} from './math';
import Arm from './Arm';
import Board from './Board';

const board = new Board ();
const arm = new Arm ();

function setup () {
  arm.init ();
  p5.createCanvas (sizes.canvasWidth, sizes.canvasHeight);
  p5.mouseClicked = () => {
    const {mouseX, mouseY} = getClick ();
    // arm.dragThroughCells ([[Math.floor (mouseX), Math.floor (mouseY)]]);
  };
}

function draw () {
  board.draw ();
  arm.draw ();
}

module.exports = {
  draw,
  setup,
};
