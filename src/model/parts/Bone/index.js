const Part = require ('../_part');
const StepperMotor = require ('../StepperMotor');
const Vector = require ('../../../math/Vector');

class Bone extends Part {
  constructor (params) {
    super (params);

    this.type = 'Bone';

    this.rootBone = params.rootBone;
    this.length = params.length;
    this.vector = new Vector (this.length, 0);

    this.attachChildren (new StepperMotor ({id: 'motor1'}));
  }

  // TODO: change to a getter
  getStartPoint () {
    return this.rootBone ? this.rootBone.getEndPoint () : new Vector (6, 4);
  }

  // TODO: change to a getter
  getEndPoint () {
    const start = this.getStartPoint ();
    return new Vector (start.x + this.vector.x, start.y + this.vector.y);
  }

  getLocalState () {
    return {
      startPoint: this.getStartPoint (),
      endPoint: this.getEndPoint (),
      length: this.length,
      // todo: add real angle
      summary: this.vector.angleBetweenDegs (1, 0).toFixed (2) + 'deg',
    };
  }

  setVector (x, y) {
    this.vector.set (x, y);
  }
}

module.exports = Bone;
