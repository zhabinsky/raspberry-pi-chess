import p5 from 'p5';

const scaleDrawers = p5 => {
  const methods = {
    line: (...r) => [...r.map (e => e * sizes.scaleRatio)],
    rect: (...r) => [...r.map (e => e * sizes.scaleRatio)],
    text: (a, ...r) => [a, ...r.map (e => e * sizes.scaleRatio)],
    image: (a, ...r) => [a, ...r.map (e => e * sizes.scaleRatio)],
    ellipse: (...r) => [...r.map (e => e * sizes.scaleRatio)],
  };
  Object.keys (methods).forEach (drawerName => {
    const func = p5[drawerName];
    p5[drawerName] = (...r) => func.bind (p5) (...methods[drawerName] (...r));
  });
  return p5;
};

const sketch = p5 => {
  scaleDrawers (p5);
  const canvasWidth = document.querySelector ('#container').offsetWidth;
  const canvasHeight = document.querySelector ('#container').offsetHeight;

  const cells = 8;
  const boneLength = Math.hypot (2, 3);
  const scaleRatio = canvasWidth / 12;

  window.sizes = {
    cells,
    boneLength,
    scaleRatio,
  };

  window.p5 = p5;

  p5.preload = () => loadImages;

  window.getClick = () => ({
    mouseX: (p5.mouseX /= sizes.scaleRatio),
    mouseY: (p5.mouseY /= sizes.scaleRatio),
  });

  p5.setup = () => {
    p5.createCanvas (canvasWidth, canvasHeight);
    // p5.mouseClicked = () => {
    //   const {mouseX, mouseY} = getClick ();
    //   arm.dragThroughCells ([[Math.floor (mouseX), Math.floor (mouseY)]]);
    // };
  };

  let points = [];
  let modelParts = [];
  subscribe (data => {
    modelParts = data;
  });

  const RENDERERS = {
    Bone: item => {
      const {startPoint, endPoint} = item.state;
      p5.fill (0, 200, 0);
      p5.stroke (0, 200, 0);
      p5.strokeWeight (5);
      p5.line (startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    },
    Arm: item => {
      const {tip} = item.state;
      const last = points[points.length - 1];
      if (!last || last.x !== tip.x || last.y !== tip.y) points.push (tip);
      points = points.slice (Math.max (0, points.length - 80));
      p5.stroke (255);
      points.forEach ((_, i) => {
        p5.strokeWeight (1);
        p5.stroke (i / points.length * 70 + 50);
        if (i < points.length - 1 && points.length > 1) {
          p5.line (points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
        }
      });
    },
  };

  p5.draw = () => {
    if (!modelParts) {
      return; // no updates
    }

    p5.background (30);
    renderBoard ();

    // render model parts
    modelParts.forEach (item => {
      const {type} = item;
      const renderer = RENDERERS[type];
      if (!renderer) return;
      renderer (item);
    });

    modelParts = false;
  };
};

function subscribe (cb) {
  const socket = new WebSocket ('ws://localhost:3000');
  socket.onmessage = function (event) {
    try {
      function traverse (item, items = []) {
        items.push (item);
        item.children.forEach (e => traverse (e, items));
        return items;
      }
      const res = JSON.parse (event.data);
      cb (traverse (res));
    } catch (e) {}
  };
}

function renderBoard () {
  window.p5.stroke (0);
  window.p5.strokeWeight (0);
  const {cells} = sizes;
  for (let i = 0; i < cells; i++) {
    for (let j = 0; j < cells; j++) {
      window.p5.fill ((j + i) % 2 === 0 ? 30 : 40);
      window.p5.rect (i, j, 1, 1);
    }
  }
  for (let i = cells; i < cells + 4; i++) {
    for (let j = 0; j < cells; j++) {
      window.p5.fill ((j + i) % 2 === 0 ? 25 : 15);
      window.p5.rect (i, j, 1, 1);
    }
  }
}

function loadImages () {
  window.images = {};
  return new Array (6).fill ().forEach ((a, i) => {
    const index = i + 1;
    window.images['w-' + index] = window.p5.loadImage (
      'assets/figures/w-' + index + '.png'
    );
    window.images['b-' + index] = window.p5.loadImage (
      'assets/figures/b-' + index + '.png'
    );
  });
}

new p5 (sketch, 'container');
