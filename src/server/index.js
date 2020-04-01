const express = require ('express');
const cors = require ('cors');
const port = 3000;

const startServer = model => {
  const app = express ();
  app.use (cors ());

  app.get ('/', (req, res) => res.json (model.toJSON ()));
  app.listen (port, () =>
    console.log (`Server is up at http://localhost:${port}`)
  );
};

module.exports = startServer;
