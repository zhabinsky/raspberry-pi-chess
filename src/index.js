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
  model.getChild ('arm').dragThroughCells ([...dir]).then (() => {
    return model
      .getChild ('arm')
      .dragThroughCells ([...dir].reverse ())
      .then (cicle);
  });

cicle ();
