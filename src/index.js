const model = require ('./model');
const startServer = require ('./server');
const gpioInterface = require ('./gpio-interface');
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

const cycle = () => {
  model.getChild ('arm1').dragThroughCells ([...dir]).then (() => {
    return model
      .getChild ('arm1')
      .dragThroughCells ([...dir].reverse ())
      .then (cycle);
  });
};

cycle ();

const gpioLed = gpioInterface (4);

gpioLed.writeStates ([0]);

const sequence = [
  [1, 0, 0, 1],
  [1, 0, 0, 0],
  [1, 1, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 1, 0],
  [0, 0, 1, 0],
  [0, 0, 1, 1],
  [0, 0, 0, 1],
];

const gpioMotor = gpioInterface (17, 18, 27, 22);

// setInterval (() => gpioLed.switchAll (), 1000);

const motorNextStates = async () => {
  for (const states of sequence) {
    await gpioMotor.writeStates (states);
    console.log ('_____');
    await wait (2000);
  }
  motorNextStates ();
};

motorNextStates ();

// while True:

//   print StepCounter,
//   print Seq[StepCounter]

//   for pin in range(0, 4):
//     xpin = StepPins[pin]#
//     if Seq[StepCounter][pin]!=0:
//       print " Enable GPIO %i" %(xpin)
//       GPIO.output(xpin, True)
//     else:
//       GPIO.output(xpin, False)

//   StepCounter += StepDir

//   # If we reach the end of the sequence
//   # start again
//   if (StepCounter&gt;=StepCount):
//     StepCounter = 0
//   if (StepCounter&lt;0):
//     StepCounter = StepCount+StepDir

//   # Wait before moving on
//   time.sleep(WaitTime)
