const Arm = require ('./parts/_Part');
const Part = require ('./concepts/Part');

class Robot extends Part {
  constructor (params) {
    super (params);

    this.type = 'Robot';

    const arm = new Arm ({id: 'arm1'});

    this.attachChildren (arm);
  }

  getLocalState () {}
}

const robot = new Robot ({id: 'robot'});

console.log (JSON.stringify (robot.toJSON (), null, 2));

module.exports = robot;
