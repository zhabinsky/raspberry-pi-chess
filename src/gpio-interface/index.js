const Gpio = require ('onoff').Gpio;

const nPorts = 27;

module.exports = (...usedPorts) => {
  const controllers = new Array (nPorts).fill ();
  const internalStates = new Array (nPorts).fill ();

  usedPorts.forEach (portName => {
    try {
      controllers[portName] = new Gpio (4, 'out');
    } catch (err) {}
  });

  const write = value => (...ports) => {
    ports.forEach (port => {
      // if (getState (port) === value) return;

      const controller = controllers[port];

      if (controller) controller.write (value);

      setState (port, value);
    });
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

    usedPorts.forEach ((port, index) => {
      write (states[index]) (port);
    });
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
