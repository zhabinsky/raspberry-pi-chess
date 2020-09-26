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
      if (getState (port) === value) return;

      const controller = controllers[port];

      if (controller) controller.writeSync (value);

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
  writeOff (...new Array (nPorts).fill ().map ((_, index) => index + 1));

  const switchPort = port => {
    const state = getState (port);
    if (state === 1) writeOff (port);
    else writeOn (port);
  };

  const setStates = states => {
    if (state.length !== usedPorts.length) throw Error ('Not enough states');
    usedPorts.forEach ((port, index) => {
      write (states[index]) (port);
    });
  };

  return {
    writeOn,
    writeOff,
    getState,
    setState,
    switchPort,
    setStates,
  };
};
