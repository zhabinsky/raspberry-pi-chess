const model = require ('./model');
const startServer = require ('./server');

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
const cicle = () =>
  model.getChild ('arm1').dragThroughCells ([...dir]).then (() => {
    return model
      .getChild ('arm1')
      .dragThroughCells ([...dir].reverse ())
      .then (cicle);
  });

cicle ();

console.log ('meow');

const Gpio = require ('onoff').Gpio; // Gpio class
const led = new Gpio (4, 'out'); // Export GPIO17 as an output

// Toggle the state of the LED connected to GPIO17 every 200ms
const iv = setInterval (_ => led.writeSync (led.readSync () ^ 1), 200);

// Stop blinking the LED after 5 seconds
setTimeout (_ => {
  clearInterval (iv); // Stop blinking
  led.unexport (); // Unexport GPIO and free resources
}, 5000);
