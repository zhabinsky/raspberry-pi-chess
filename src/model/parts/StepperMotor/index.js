const Part = require ('../_part');
const Vector = require ('../../../math/Vector');
const motorInterface = require ('../../../interfaces/motor-interface');

class StepperMotor extends Part {
  constructor (params) {
    super (params);

    this.type = 'StepperMotor';
    this.motorInterface = motorInterface (params.motorPorts);
    this.toDegrees = this.motorInterface.toDegrees;
  }

  getLocalState () {
    return {
      summary: this.motorInterface.getDegrees () + 'deg',
    };
  }
}

module.exports = StepperMotor;
