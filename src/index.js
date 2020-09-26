const model = require ('./model');
const startServer = require ('./server');
const gpioInterface = require ('./interfaces/gpio-interface');
const wait = require ('./utils/wait');

startServer (model);

const dir = [
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
];

const cycle = async () => {
  const arm = model.getChild ('arm1');
  await arm.dragThroughCells ([...dir]);
  await arm.dragThroughCells ([...dir].reverse ());

  cycle ();
};

cycle ();

const gpioLed = gpioInterface (4);

gpioLed.writeStates ([0]);

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

const gpioMotor1 = gpioInterface (17, 18, 27, 22);
const gpioMotor2 = gpioInterface (23, 24, 25, 4);

gpioMotor1.generateRestInterface ();
gpioMotor2.generateRestInterface ();

const motorNextStates = steps => {
  const loop = async (device, step = 0) => {
    if (step === steps) return;

    for (const states of sequence) {
      await device.writeStates (states);
      await wait (8);
    }

    await loop (device, step + 1);
  };

  return loop;
};

(async () => {
  const turnAround = motorNextStates (512);
  await turnAround (gpioMotor2);
  await wait (2000);
  await turnAround (gpioMotor2);
  await wait (2000);
  await turnAround (gpioMotor2);
  await wait (2000);
  await turnAround (gpioMotor2);
  await wait (2000);
  await turnAround (gpioMotor2);
}) ();
