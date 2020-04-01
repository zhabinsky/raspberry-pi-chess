import {getIntersection} from './math';
import Bone from './Bone';

function Arm () {
  this.bones = [];
  this.getBone = i => this.bones[i - 1];
  this.bones[0] = new Bone (null);
  this.bones[1] = new Bone (this.getBone (1));

  this.initialised = false;
  this.init = async () => {
    this.dragThroughCells ([[0, 0]], true).then (() => {
      this.initialised = true;
    });
  };

  this.getCurrentCell = (x, y) => [Math.floor (x), Math.floor (y)];

  this.dragThroughCells = async path => {
    for (let i = 0; i < path.length; i++) {
      const [x, y] = path[i];
      const moveX = x + 0.5;
      const moveY = y + 0.5;
      const currentEndPoint = this.getBone (2).getEndPoint ().copy ();
      const distance = Math.hypot (
        moveX - currentEndPoint.x,
        moveY - currentEndPoint.y
      );
      const steps = Math.floor (distance * 10);
      const stepX = (moveX - currentEndPoint.x) / steps;
      const stepY = (moveY - currentEndPoint.y) / steps;
      for (let j = 1; j < steps + 1; j++) {
        this.alignBones (
          currentEndPoint.x + j * stepX,
          currentEndPoint.y + j * stepY
        );
        if (j === steps) {
          this.alignBones (moveX, moveY);
        }

        // this.trackcursor ();
      }
    }
  };

  this.alignBones = async (goalX, goalY) => {
    const intersection = getIntersection (
      this.getBone (1).getStartPoint ().x,
      this.getBone (1).getStartPoint ().y,
      sizes.boneLength,
      goalX,
      goalY,
      sizes.boneLength
    );
    if (!intersection) return;
    const [intersectionX, intersectionY] = intersection;
    // debugPoint = intersection;
    this.getBone (1).vector.setInterpolate (
      intersectionX - this.getBone (1).getStartPoint ().x,
      intersectionY - this.getBone (1).getStartPoint ().y
    );
    this.getBone (2).vector.setInterpolate (
      goalX - intersectionX,
      goalY - intersectionY
    );
  };

  this.draw = () => {
    if (!this.initialised) return;
    const armEnd = this.getBone (2).getEndPoint ();
    const [x, y] = this.getCurrentCell (armEnd.x, armEnd.y);
    p5.noFill ();
    p5.stroke (0, 255, 0);
    p5.rect (x, y, 1, 1);
    p5.stroke (255, 0, 0);
    p5.noFill ();
    p5.ellipse (
      this.getBone (1).getStartPoint ().x,
      this.getBone (1).getStartPoint ().y,
      sizes.boneLength * 4
    );
    this.getBone (1).draw ();
    this.getBone (2).draw ([200, 0, 0]);
    this.drawTrackPoints ();
  };

  this.loop = () => {
    this.dragThroughCells ([
      [1, 0],
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 3],
      [2, 4],
      [3, 4],
      [3, 5],
      [4, 5],
      [5, 5],
      [6, 5],
      [7, 5],
      [7, 4],
      [7, 3],
      [7, 2],
      [7, 1],
      [7, 0],
      [6, 0],
      [5, 0],
      [4, 0],
      [3, 0],
      [2, 0],
      [2, 1],
      [1, 1],
      [1, 0],
    ]).then (this.loop);
  };

  // let debugPoint = [-100, -100];
}

export default Arm;
