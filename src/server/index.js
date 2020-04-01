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

  function onWSConnection (ws) {
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
  }

  wss.on ('connection', onWSConnection);

  // app.get ('/', (req, res) => res.json (model.toJSON ()));
  server.listen (port, () =>
    console.log (`Server is up at http://localhost:${port}`)
  );
};

module.exports = startServer;

String.prototype.hashCode = function () {
  let hash = 0;
  if (this.length == 0) return hash;
  for (let i = 0; i < this.length; i++) {
    hash = (hash << 5) - hash + this.charCodeAt (i);
    hash = hash & hash;
  }
  return hash;
};
