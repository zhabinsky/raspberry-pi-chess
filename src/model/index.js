const Arm = require ('./parts/Arm');
const Part = require ('./parts/_part');

class Robot extends Part {
  constructor (params) {
    super (params);

    this.type = 'Robot';

    const arm = new Arm ({id: 'arm1'});

    this.attachChildren (arm);
  }
}

module.exports = new Robot ({id: 'robot'});
