const model = require ('./model');
const startServer = require ('./server');

startServer (model);

console.log (JSON.stringify (model.toJSON (), null, 2));

setTimeout (() => {
  model.getChild ('arm').pointBones (0, 0);
}, 4000);
