const Part = require ('../_part');
const Vector = require ('../../../math/Vector');

class StepperMotor extends Part {
  constructor (params) {
    super (params);

    this.type = 'StepperMotor';
    this.angle = 0;
  }

  getLocalState () {
    return {
      summary: this.angle + 'deg',
    };
  }
}

module.exports = StepperMotor;
