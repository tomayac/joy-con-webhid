import {
  connectJoyCon,
  connectedJoyCons,
  JoyConLeft,
} from '../dist/joy-con-webhid.es.js';

const connectButton = document.querySelector('#connect-joy-cons');
const connectMidiButton = document.querySelector('#connect-midi');
const connectMidiLabel = document.querySelector('#connect-midi-label');
const debugLeft = document.querySelector('#debug-left');
const debugRight = document.querySelector('#debug-right');
const showVisualize = document.querySelector('#show-visualize');
const showDebug = document.querySelector('#show-debug');
const rootStyle = document.documentElement.style;

connectButton.addEventListener('click', connectJoyCon);

let midiout = null;

const onMIDISuccess = (midiAccess) => {
  const outputs = midiAccess.outputs;
  for (const o of outputs.values()) {
    midiout = o;
    console.log(o);
    connectMidiLabel.textContent = 'Connected to ' + o.name;
    return;
  }
  connectMidiLabel.textContent = 'No MIDI receivers found!';
};

const onMIDIFailure = () => {
  connectMidiLabel.textContent = 'Permission denied by browser';
};

const connectMidi = () => {
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    return;
  } else {
    connectMidiLabel.textContent = 'MIDI unsupported by browser';
  }
};

connectMidiButton.addEventListener('click', connectMidi);

const sendMidi = (bytes, msg = '') => {
  if (midiout) {
    console.log(bytes + ' ' + msg);
    midiout.send(bytes);
  } else {
    console.log('MIDI not connected');
  }
};

const MIDI_NOTE_ON_CH_1 = 0x90;
const MIDI_NOTE_OFF_CH_1 = 0x80;
const MIDI_VELOCITY_MAX = 0x7f;
const MIDI_VELOCITY_MIN = 0;
const MIDI_CC_CH_1 = 0xb0;

// Returns a function that converts a boolean value to a note-on or note-off
// message.
const noteOnOff = (note) => {
  return (readValue) => [
    readValue ? MIDI_NOTE_ON_CH_1 : MIDI_NOTE_OFF_CH_1,
    note,
    MIDI_VELOCITY_MAX,
  ];
};

// Returns a function that converts a boolean value to a CC message.
const buttonCCForControl = (control) => {
  return (readValue) => [
    MIDI_CC_CH_1,
    control,
    readValue ? MIDI_VELOCITY_MAX : MIDI_VELOCITY_MIN,
  ];
};

// Returns a function that convents a float in the range 0-1 to a CC message.
const analogCCForControl = (control) => {
  return (readValue) => [
    MIDI_CC_CH_1,
    control,
    Math.max(
      Math.min(Math.round(127 * readValue), MIDI_VELOCITY_MAX),
      MIDI_VELOCITY_MIN
    ),
  ];
};

const leftControls = [
  // Define buttons first since they're latency critical and the updates are
  // rarer.
  {
    name: 'down-button',
    read_value: (packet) => packet.buttonStatus.down,
    generate_midi: noteOnOff(0x24),
  },
  {
    name: 'right-button',
    read_value: (packet) => packet.buttonStatus.right,
    generate_midi: noteOnOff(0x25),
  },
  {
    name: 'up-button',
    read_value: (packet) => packet.buttonStatus.up,
    generate_midi: noteOnOff(0x26),
  },
  {
    name: 'left-button',
    read_value: (packet) => packet.buttonStatus.left,
    generate_midi: noteOnOff(0x27),
  },
  {
    name: 'l-button',
    read_value: (packet) => packet.buttonStatus.l,
    generate_midi: noteOnOff(0x28),
  },
  {
    name: 'zl-button',
    read_value: (packet) => packet.buttonStatus.zl,
    generate_midi: noteOnOff(0x29),
  },
  {
    name: 'capture-button-as-note',
    read_value: (packet) => packet.buttonStatus.capture,
    generate_midi: noteOnOff(0x2a),
  },
  {
    name: 'minus-button-as-note',
    read_value: (packet) => packet.buttonStatus.minus,
    generate_midi: noteOnOff(0x2b),
  },

  // Control (CC) buttons
  {
    name: 'minus-button-as-cc',
    read_value: (packet) => packet.buttonStatus.minus,
    generate_midi: buttonCCForControl(0x01),
  },
  {
    name: 'capture-button-as-cc',
    read_value: (packet) => packet.buttonStatus.capture,
    generate_midi: buttonCCForControl(0x02),
  },
  {
    name: 'l-sl-button',
    read_value: (packet) => packet.buttonStatus.sl,
    generate_midi: buttonCCForControl(0x03),
  },
  {
    name: 'l-sr-button',
    read_value: (packet) => packet.buttonStatus.sr,
    generate_midi: buttonCCForControl(0x04),
  },
  {
    name: 'l-stick',
    read_value: (packet) => packet.buttonStatus.leftStick,
    generate_midi: buttonCCForControl(0x05),
  },

  // Analog controls (CC)
  {
    name: 'l-orientation.beta',
    read_value: (packet) =>
      (Number(packet.actualOrientation.beta) + 90.0) / 180.0,
    generate_midi: analogCCForControl(0x0b),
    threshold: 3 / 180.0,
  },
  {
    name: 'l-orientation.gamma',
    read_value: (packet) =>
      (Number(packet.actualOrientation.gamma) + 90.0) / 180.0,
    generate_midi: analogCCForControl(0x0c),
    threshold: 3 / 180.0,
  },
  {
    name: 'l-analog-horizontal',
    read_value: (packet) => {
      const hmin = -1.2;
      const hmax = 1.4;
      return (
        (Math.max(
          hmin,
          Math.min(Number(packet.analogStickLeft.horizontal), hmax)
        ) -
          hmin) /
        (hmax - hmin)
      );
    },
    generate_midi: analogCCForControl(0x0d),
    threshold: 0.02,
  },
  {
    name: 'l-analog-vertical',
    read_value: (packet) => {
      const vmin = -0.7;
      const vmax = 0.9;
      return (
        (Math.max(
          vmin,
          Math.min(Number(packet.analogStickLeft.vertical), vmax)
        ) -
          vmin) /
        (vmax - vmin)
      );
    },
    generate_midi: analogCCForControl(0x0e),
    threshold: 0.02,
  },
];

const rightControls = [
  // Define buttons first since they're latency critical and the updates are
  // rarer.
  {
    name: 'b-button',
    read_value: (packet) => packet.buttonStatus.b,
    generate_midi: noteOnOff(0x2c),
  },
  {
    name: 'a-button',
    read_value: (packet) => packet.buttonStatus.a,
    generate_midi: noteOnOff(0x2d),
  },
  {
    name: 'x-button',
    read_value: (packet) => packet.buttonStatus.x,
    generate_midi: noteOnOff(0x2e),
  },
  {
    name: 'y-button',
    read_value: (packet) => packet.buttonStatus.y,
    generate_midi: noteOnOff(0x2f),
  },
  {
    name: 'r-button',
    read_value: (packet) => packet.buttonStatus.r,
    generate_midi: noteOnOff(0x30),
  },
  {
    name: 'zr-button',
    read_value: (packet) => packet.buttonStatus.zr,
    generate_midi: noteOnOff(0x31),
  },
  {
    name: 'home-button-as-note',
    read_value: (packet) => packet.buttonStatus.home,
    generate_midi: noteOnOff(0x32),
  },
  {
    name: 'plus-button-as-note',
    read_value: (packet) => packet.buttonStatus.plus,
    generate_midi: noteOnOff(0x33),
  },

  // Control (CC) buttons
  {
    name: 'plus-button-as-cc',
    read_value: (packet) => packet.buttonStatus.plus,
    generate_midi: buttonCCForControl(0x06),
  },
  {
    name: 'home-button-as-cc',
    read_value: (packet) => packet.buttonStatus.home,
    generate_midi: buttonCCForControl(0x07),
  },
  {
    name: 'sr-button',
    read_value: (packet) => packet.buttonStatus.sr,
    generate_midi: buttonCCForControl(0x08),
  },
  {
    name: 'sl-button',
    read_value: (packet) => packet.buttonStatus.sl,
    generate_midi: buttonCCForControl(0x09),
  },
  {
    name: 'r-stick',
    read_value: (packet) => packet.buttonStatus.rightStick,
    generate_midi: buttonCCForControl(0x0a),
  },

  // Analog controls (CC)
  {
    name: 'orientation.beta',
    read_value: (packet) =>
      (Number(packet.actualOrientation.beta) + 90.0) / 180.0,
    generate_midi: analogCCForControl(0x0f),
    threshold: 3 / 180.0,
  },
  {
    name: 'orientation.gamma',
    read_value: (packet) =>
      (Number(packet.actualOrientation.gamma) + 90.0) / 180.0,
    generate_midi: analogCCForControl(0x10),
    threshold: 3 / 180.0,
  },
  {
    name: 'r-analog-horizontal',
    read_value: (packet) => {
      const hmin = -1.2;
      const hmax = 1.4;
      return (
        (Math.max(
          hmin,
          Math.min(Number(packet.analogStickRight.horizontal), hmax)
        ) -
          hmin) /
        (hmax - hmin)
      );
    },
    generate_midi: analogCCForControl(0x11),
    threshold: 0.02,
  },
  {
    name: 'r-analog-vertical',
    read_value: (packet) => {
      const vmin = -0.7;
      const vmax = 1.4;
      return (
        (Math.max(
          vmin,
          Math.min(Number(packet.analogStickRight.vertical), vmax)
        ) -
          vmin) /
        (vmax - vmin)
      );
    },
    generate_midi: analogCCForControl(0x12),
    threshold: 0.02,
  },
];

/**
 * Updates the given control based on the provided packet data.
 * If the change in value exceeds the control's threshold, generates and sends a MIDI message.
 *
 * @param {Object} control - The control object to update.
 * @param {number|Object} packet - The incoming data packet used to read the new value.
 * @property {number} [control.threshold=0] - The minimum change required to trigger an update.
 * @property {number} [control.last_value] - The last value processed for this control.
 * @property {number} [control.init_value=0] - The initial value to use if last_value is undefined.
 * @property {function} control.read_value - Function to extract the value from the packet.
 * @property {function} control.generate_midi - Function to generate a MIDI message from the value.
 * @property {string} control.name - The name of the control, used for sending MIDI.
 */
const updateControl = (control, packet) => {
  window.lastPacket = packet;
  if (control.threshold === undefined) {
    control.threshold = 0;
  }
  if (control.last_value === undefined) {
    if (control.init_value === undefined) {
      control.init_value = 0;
    }
    control.last_value = control.init_value;
  }
  const newValue = control.read_value(packet);
  if (Math.abs(newValue - control.last_value) > control.threshold) {
    const msg = control.generate_midi(newValue);
    if (msg !== undefined) {
      sendMidi(msg, control.name);
    }
    control.last_value = newValue;
  }
};

const updateBothControls = (joyCon, packet) => {
  if (!packet || !packet.actualOrientation) {
    return;
  }
  if (joyCon instanceof JoyConLeft) {
    for (const control of leftControls) {
      updateControl(control, packet);
    }
  } else {
    for (const control of rightControls) {
      updateControl(control, packet);
    }
  }
};

const visualize = (joyCon, packet) => {
  if (!packet || !packet.actualOrientation) {
    return;
  }

  const {
    actualAccelerometer: accelerometer,
    buttonStatus: buttons,
    actualGyroscope: gyroscope,
    actualOrientation: orientation,
    actualOrientationQuaternion: orientationQuaternion,
  } = packet;

  if (showVisualize.checked) {
    if (joyCon instanceof JoyConLeft) {
      rootStyle.setProperty('--left-alpha', `${orientation.alpha}deg`);
      rootStyle.setProperty('--left-beta', `${orientation.beta}deg`);
      rootStyle.setProperty('--left-gamma', `${orientation.gamma}deg`);
    } else {
      rootStyle.setProperty('--right-alpha', `${orientation.alpha}deg`);
      rootStyle.setProperty('--right-beta', `${orientation.beta}deg`);
      rootStyle.setProperty('--right-gamma', `${orientation.gamma}deg`);
    }

    if (joyCon instanceof JoyConLeft) {
      const joystick = packet.analogStickLeft;
      const joystickMultiplier = 10;
      document.querySelector('#joystick-left').style.transform = `translateX(${
        joystick.horizontal * joystickMultiplier
      }px) translateY(${joystick.vertical * joystickMultiplier}px)`;

      document.querySelector('#up').classList.toggle('highlight', buttons.up);
      document
        .querySelector('#down')
        .classList.toggle('highlight', buttons.down);
      document
        .querySelector('#left')
        .classList.toggle('highlight', buttons.left);
      document
        .querySelector('#right')
        .classList.toggle('highlight', buttons.right);
      document
        .querySelector('#capture')
        .classList.toggle('highlight', buttons.capture);
      document
        .querySelector('#l')
        .classList.toggle('highlight', buttons.l || buttons.zl);
      document
        .querySelector('#l')
        .classList.toggle('highlight', buttons.l || buttons.zl);
      document
        .querySelector('#minus')
        .classList.toggle('highlight', buttons.minus);
      document
        .querySelector('#joystick-left')
        .classList.toggle('highlight', buttons.leftStick);
    } else {
      const joystick = packet.analogStickRight;
      const joystickMultiplier = 10;
      document.querySelector('#joystick-right').style.transform = `translateX(${
        joystick.horizontal * joystickMultiplier
      }px) translateY(${joystick.vertical * joystickMultiplier}px)`;

      document.querySelector('#a').classList.toggle('highlight', buttons.a);
      document.querySelector('#b').classList.toggle('highlight', buttons.b);
      document.querySelector('#x').classList.toggle('highlight', buttons.x);
      document.querySelector('#y').classList.toggle('highlight', buttons.y);
      document
        .querySelector('#home')
        .classList.toggle('highlight', buttons.home);
      document
        .querySelector('#r')
        .classList.toggle('highlight', buttons.r || buttons.zr);
      document
        .querySelector('#r')
        .classList.toggle('highlight', buttons.r || buttons.zr);
      document
        .querySelector('#plus')
        .classList.toggle('highlight', buttons.plus);
      document
        .querySelector('#joystick-right')
        .classList.toggle('highlight', buttons.rightStick);
    }
  }

  if (showDebug.checked) {
    const controller = joyCon instanceof JoyConLeft ? debugLeft : debugRight;
    controller.querySelector('pre').textContent =
      JSON.stringify(orientation, null, 2) +
      '\n' +
      JSON.stringify(orientationQuaternion, null, 2) +
      '\n' +
      JSON.stringify(gyroscope, null, 2) +
      '\n' +
      JSON.stringify(accelerometer, null, 2) +
      '\n';
    const meterMultiplier = 300;
    controller.querySelector('#acc-x').value =
      accelerometer.x * meterMultiplier;
    controller.querySelector('#acc-y').value =
      accelerometer.y * meterMultiplier;
    controller.querySelector('#acc-z').value =
      accelerometer.z * meterMultiplier;

    const gyroscopeMultiplier = 300;
    controller.querySelector('#gyr-x').value =
      gyroscope.rps.x * gyroscopeMultiplier;
    controller.querySelector('#gyr-y').value =
      gyroscope.rps.y * gyroscopeMultiplier;
    controller.querySelector('#gyr-z').value =
      gyroscope.rps.z * gyroscopeMultiplier;
  }
};

// Joy-Cons may sleep until touched, so attach the listener dynamically.
setInterval(async () => {
  for (const joyCon of connectedJoyCons.values()) {
    if (joyCon.eventListenerAttached) {
      continue;
    }
    joyCon.eventListenerAttached = true;
    await joyCon.disableVibration();
    joyCon.addEventListener('hidinput', (event) => {
      updateBothControls(joyCon, event.detail);
      visualize(joyCon, event.detail);
    });
  }
}, 2000);

showDebug.addEventListener('input', (e) => {
  document.querySelector('#debug').style.display = e.target.checked
    ? 'flex'
    : 'none';
});

connectMidi();
