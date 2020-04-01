const express = require ('express');
const cors = require ('cors');
const http = require ('http');
const ws = require ('ws');
const port = 3000;

const startServer = model => {
  const app = express ();
  app.use (cors ());

  const server = http.createServer (app);
  const wss = new ws.Server ({server});

  wss.on ('connection', ws => {
    ws.on ('message', message => {
      ws.send (`Hello, you sent -> ${message}`);
    });
    let lastDataHash = 0;
    const notify = () => {
      const data = JSON.stringify (model.toJSON ());
      const hash = data.hashCode ();

      if (lastDataHash !== hash) {
        ws.send (data);
        lastDataHash = hash;
      }
    };
    setInterval (notify, 10);
    notify ();
  });

  // app.get ('/', (req, res) => res.json (model.toJSON ()));
  server.listen (port, () =>
    console.log (`Server is up at http://localhost:${port}`)
  );
};

module.exports = startServer;

String.prototype.hashCode = function () {
  var hash = 0;
  if (this.length == 0) {
    return hash;
  }
  for (var i = 0; i < this.length; i++) {
    var char = this.charCodeAt (i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};
