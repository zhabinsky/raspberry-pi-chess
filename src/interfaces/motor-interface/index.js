const gpioInterface = require ('../gpio-interface');
const wait = require ('../../utils/wait');

const sequence = [
  [1, 0, 0, 1],
  // [1, 0, 1, 1],
  [1, 0, 0, 0],
  // [1, 1, 0, 0],
  [0, 1, 0, 0],
  // [0, 1, 1, 0],
  [0, 0, 1, 0],
  // [0, 0, 1, 1],
  [0, 0, 0, 1],
];

const sequenceReverse = [...sequence].reverse ();
const sequenceCountRotation = 512;
const degreesPerSequence = 360 / sequenceCountRotation;

const motorInterface = ports => {
  const state = {
    degrees: 0,
  };

  const motor = gpioInterface (...ports);

  const toDegrees = async degrees => {
    const currentDegrees = state.degrees;
    const degreesDelta = degrees - currentDegrees;
    const direction = degreesDelta > 0 ? 1 : -1;
    const currentSequence = direction === 1 ? sequence : sequenceReverse;

    for (let i = 0; i < Math.abs (degreesDelta / degreesPerSequence); i++) {
      for (const states of currentSequence) {
        await motor.writeStates (states);
        await wait (10);
      }
      //   state.degrees += degreesPerSequence * direction;
    }
    state.degrees = degrees;
  };

  const getDegrees = () => {
    return state.degrees;
  };

  return {
    toDegrees,
    getDegrees,
  };
};

module.exports = motorInterface;
