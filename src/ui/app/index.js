import p5 from 'p5';
import Vector from './Vector';

const scaleDrawers = p5 => {
  const originalDrawers = {
    line: {
      func: p5.line,
      args: (...rest) => [...rest.map (e => e * sizes.scaleRatio)],
    },
    rect: {
      func: p5.rect,
      args: (...rest) => [...rest.map (e => e * sizes.scaleRatio)],
    },
    text: {
      func: p5.text,
      args: (a, ...rest) => [a, ...rest.map (e => e * sizes.scaleRatio)],
    },
    image: {
      func: p5.image,
      args: (a, ...rest) => [a, ...rest.map (e => e * sizes.scaleRatio)],
    },
    ellipse: {
      func: p5.ellipse,
      args: (...rest) => [...rest.map (e => e * sizes.scaleRatio)],
    },
  };
  Object.keys (originalDrawers).forEach (drawerName => {
    p5[drawerName] = function (...rest) {
      const {func, args} = originalDrawers[drawerName];
      func.bind (p5) (...args (...rest));
    };
  });
  return p5;
};

const sketch = p5 => {
  const canvasWidth = document.querySelector ('#container').offsetWidth;
  const canvasHeight = document.querySelector ('#container').offsetHeight;
  console.log (canvasWidth, canvasHeight);
  const fieldHeight = 8;
  const fieldWidth = 8;
  const cells = 8;
  const boneLength = Math.hypot (2, 3);
  let scaleRatio = canvasWidth / 12;
  window.sizes = {
    canvasWidth,
    canvasHeight,
    fieldHeight,
    fieldWidth,
    cells,
    boneLength,
    scaleRatio,
  };

  window.p5 = scaleDrawers (p5);
  window.Vector = Vector;
  window.images = {};

  p5.preload = () => {
    new Array (6).fill ().forEach ((a, i) => {
      const index = i + 1;
      images['w-' + index] = p5.loadImage (
        'assets/figures/w-' + index + '.png'
      );
      images['b-' + index] = p5.loadImage (
        'assets/figures/b-' + index + '.png'
      );
    });
  };

  window.getClick = () => {
    return {
      mouseX: (p5.mouseX /= sizes.scaleRatio),
      mouseY: (p5.mouseY /= sizes.scaleRatio),
    };
  };

  const Simulation = require ('./Simulation');

  function renderBoard () {
    const {cells} = sizes;
    for (let i = 0; i < cells; i++) {
      for (let j = 0; j < cells; j++) {
        p5.fill ((j + i) % 2 === 0 ? 30 : 40);
        p5.rect (i, j, 1, 1);
      }
    }
    for (let i = cells; i < cells + 4; i++) {
      for (let j = 0; j < cells; j++) {
        p5.fill ((j + i) % 2 === 0 ? 25 : 15);
        p5.rect (i, j, 1, 1);
      }
    }
  }

  p5.setup = () => {
    Simulation.setup ();
  };

  function traverse (item, items = []) {
    items.push (item);
    item.children.forEach (e => traverse (e, items));
    return items;
  }
  let modelParts = [];
  const socket = new WebSocket ('ws://localhost:3000');
  socket.onmessage = function (event) {
    console.count ('ws message');
    try {
      const res = JSON.parse (event.data);
      modelParts = traverse (res);
    } catch (e) {}
  };

  p5.draw = () => {
    if (!modelParts) return;

    p5.background (20);

    modelParts.forEach (item => {
      const {type, state} = item;

      p5.stroke (0, 200, 0);
      p5.fill (0, 200, 0);
      p5.strokeWeight (5);

      if (type === 'Bone') {
        const {startPoint, endPoint} = state;
        p5.line (startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      }
    });

    // p5.noStroke ();
    // renderBoard ();
    // p5.stroke (255);
    // Simulation.draw ();

    modelParts = false;
  };
};

window.addEventListener ('load', event => {
  new p5 (sketch, 'container');
});
