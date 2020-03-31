import Vector from './Vector';

window.startPoint = new Vector (6, 4);

function Bone (rootBone) {
  this.rootBone = rootBone;

  this.startPoint = new Vector ();
  this.getStartPoint = () => {
    const a = this.rootBone ? this.rootBone.getEndPoint () : startPoint;
    this.startPoint.set (a.x, a.y);
    return this.startPoint;
  };

  this.vector = new Vector (0, sizes.boneLength);

  this.endPoint = new Vector ();
  this.getEndPoint = () => {
    const startPoint = this.getStartPoint ();
    const {vector} = this;
    this.endPoint.set (startPoint.x + vector.x, startPoint.y + vector.y);
    return this.endPoint;
  };

  this.getLine = () => {
    const s = this.getStartPoint ();
    const e = this.getEndPoint ();
    return [s.x, s.y, e.x, e.y];
  };

  this.draw = (color = [0, 200, 0]) => {
    const line = this.getLine ();

    // line
    p5.stroke (...color);
    p5.fill (...color);
    p5.strokeWeight (5);
    p5.line (...line);
    p5.ellipse (line[0], line[1], sizes.boneLength * 0.01);
    p5.ellipse (line[2], line[3], sizes.boneLength * 0.01);

    p5.strokeWeight (1);
    // // reach zone
    // p5.noFill ();
    // p5.stroke (100, 100, 250);
    // p5.ellipse (line[0], line[1], sizes.boneLength * 2);
    // // p5.stroke (240);
    // p5.line (line[0], line[1], line[0] + sizes.boneLength, line[1]);
  };
}

export default Bone;
