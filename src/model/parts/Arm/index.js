const Part = require ('../_part');
const Bone = require ('../Bone');
const getIntersection = require ('../../../math/getIntersection');

class Arm extends Part {
  constructor (params) {
    super (params);

    this.type = 'Arm';

    const boneLength = Math.hypot (3, 2);

    const bone1 = new Bone ({id: 'bone1', length: boneLength, rootBone: null});
    const bone2 = new Bone ({id: 'bone2', length: boneLength, rootBone: bone1});

    this.attachChildren (bone1, bone2);
  }

  getLocalState () {
    return null;
  }

  async dragThroughCells (path) {
    for (let i = 0; i < path.length; i++) {
      const [x, y] = path[i];

      const pointer = this.getChild ('bone2').getEndPoint ().copy ();
      // TODO: use vector for math
      const moveX = x + 0.5;
      const moveY = y + 0.5;
      const distance = Math.hypot (moveX - pointer.x, moveY - pointer.y);
      const steps = Math.floor (distance * 10); // keep the speed constan

      const dx = (moveX - pointer.x) / steps;
      const dy = (moveY - pointer.y) / steps;

      for (let j = 1; j < steps + 1; j++) {
        await this.pointBones (pointer.x + j * dx, pointer.y + j * dy);
      }
      await this.pointBones (moveX, moveY);
    }
  }

  async pointBones (x, y) {
    const bone1 = this.getChild ('bone1');
    const bone2 = this.getChild ('bone2');

    const joint = bone1.getStartPoint ();

    const jointNew = getIntersection (
      joint.x,
      joint.y,
      bone1.length,
      x,
      y,
      bone2.length
    );

    if (!jointNew) {
      throw Error ('no interesection');
    }
    // todo: create setter
    bone1.setVector (jointNew.x - joint.x, jointNew.y - joint.y);
    bone2.setVector (x - jointNew.x, y - jointNew.y);

    await timeout (20);
  }
}

module.exports = Arm;

function timeout (ms) {
  return new Promise (resolve => setTimeout (resolve, ms));
}
