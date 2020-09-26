const Gpio = require ('onoff').Gpio;

const nPorts = 27;

const gpioInterface = (...usedPorts) => {
  const controllers = new Array (nPorts).fill ();
  const internalStates = new Array (nPorts).fill ();

  usedPorts.forEach (port => {
    try {
      controllers[port] = new Gpio (port, 'out');
    } catch (err) {}
  });

  const write = value => (...ports) => {
    for (const port of ports) {
      if (getState (port) === value) return;

      const controller = controllers[port];

      if (controller) controller.writeSync (value, console.log);

      setState (port, value);
    }
  };

  const getState = port => internalStates[port];
  const setState = (port, value) => (internalStates[port] = value);

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
    for (let i = 0; i < usedPorts.length; i++)
      write (states[i]) (usedPorts[i]);
  };

  const switchAll = () => usedPorts.forEach (switchPort);

  return {
    writeOn,
    writeOff,
    getState,
    switchPort,
    switchAll,
    writeStates,
    generateRestInterface: () => {
      return gpioInterface (
        ...new Array (nPorts)
          .fill ()
          .map (e => e + 1)
          .filter (e => usedPorts.indexOf (e) === -1)
      );
    },
  };
};

module.exports = gpioInterface;
