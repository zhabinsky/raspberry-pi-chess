const Gpio = require ('onoff').Gpio;

const nPorts = 27;

module.exports = (...usedPorts) => {
  const controllers = new Array (nPorts).fill ();
  const internalStates = new Array (nPorts).fill ();

  usedPorts.forEach (port => {
    try {
      controllers[port] = new Gpio (port, 'out');
    } catch (err) {}
  });

  const write = value => (...ports) => {
    for (const port of ports) {
      // if (getState (port) === value) return;

      const controller = controllers[port];

      if (controller) controller.write (value, console.log);

      setState (port, value);
    }
  };

  const getState = port => internalStates[port];
  const setState = (port, value) => {
    console.log (`Port: ${port} value: ${value}`);
    internalStates[port] = value;
  };

  const writeOn = write (1);
  const writeOff = write (0);

  // turn all ports off
  writeOff (...usedPorts);

  const switchPort = port => {
    const state = getState (port);
    if (state === 1) writeOff (port);
    else writeOn (port);
  };

  const writeStates = states => {
    if (states.length !== usedPorts.length) throw Error ('Not enough states');

    for (let i = 0; i < usedPorts.length; i++) {
      write (states[i]) (usedPorts[i]);
    }
  };

  const switchAll = () => usedPorts.forEach (switchPort);

  return {
    writeOn,
    writeOff,
    getState,
    switchPort,
    switchAll,
    writeStates,
  };
};
