const left = document.querySelector('#left');
const right = document.querySelector('#right');
const up = document.querySelector('#up');
const down = document.querySelector('#down');
const capture = document.querySelector('#capture');
const minus = document.querySelector('#minus');
const leftJoystick = document.querySelector('#joycon-l .joystick');
const l = document.querySelector('#l');

const x = document.querySelector('#x');
const y = document.querySelector('#y');
const a = document.querySelector('#a');
const b = document.querySelector('#b');
const home = document.querySelector('#home');
const plus = document.querySelector('#plus');
const rightJoystick = document.querySelector('#joycon-r .joystick');
const r = document.querySelector('#r');

const toPaddedString = (bytes) =>
  [bytes, ...new Array(11 - bytes.length).fill(0)].flat().join();

const BUTTON_MAPPING = {
  // Joy-Con Left
  0x2006: {
    [toPaddedString([1, 0, 8, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'Left',
      element: left,
    },
    [toPaddedString([2, 0, 8, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'Down',
      element: down,
    },
    [toPaddedString([4, 0, 8, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'Up',
      element: up,
    },
    [toPaddedString([8, 0, 8, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'Right',
      element: right,
    },
    [toPaddedString([0, 1, 8, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'Minus',
      element: minus,
    },
    [toPaddedString([0, 32, 8, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'Capture',
      element: capture,
    },
    [toPaddedString([0, 64, 8, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'L',
      element: l,
    },
    [toPaddedString([0, 128, 8, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'ZL',
      element: l,
    },
    [toPaddedString([16, 0, 8, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'SL',
      element: null,
    },
    [toPaddedString([32, 0, 8, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'SR',
      element: null,
    },

    [toPaddedString([0, 0, 4, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'StickLeft',
      element: leftJoystick,
    },
    [toPaddedString([0, 0, 0, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'StickRight',
      element: leftJoystick,
    },
    [toPaddedString([0, 0, 6, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'StickUp',
      element: leftJoystick,
    },
    [toPaddedString([0, 0, 2, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'StickDown',
      element: leftJoystick,
    },
  },

  // Joy-Con Right
  0x2007: {
    [toPaddedString([1, 0, 8, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'A',
      element: a,
    },
    [toPaddedString([2, 0, 8, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'X',
      element: x,
    },
    [toPaddedString([4, 0, 8, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'B',
      element: b,
    },
    [toPaddedString([8, 0, 8, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'Y',
      element: y,
    },
    [toPaddedString([0, 2, 8, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'Plus',
      element: plus,
    },
    [toPaddedString([0, 16, 8, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'Home',
      element: home,
    },
    [toPaddedString([0, 64, 8, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'R',
      element: r,
    },
    [toPaddedString([0, 128, 8, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'ZR',
      element: r,
    },
    [toPaddedString([16, 0, 8, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'SL',
      element: null,
    },
    [toPaddedString([32, 0, 8, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'SR',
      element: null,
    },

    [toPaddedString([0, 0, 4, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'StickRight',
      element: rightJoystick,
    },
    [toPaddedString([0, 0, 0, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'StickLeft',
      element: rightJoystick,
    },
    [toPaddedString([0, 0, 6, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'StickDown',
      element: rightJoystick,
    },
    [toPaddedString([0, 0, 2, 0, 128, 0, 128, 0, 128, 0, 128])]: {
      name: 'StickUp',
      element: rightJoystick,
    },
  },
};

let devices = [];

navigator.hid.addEventListener('connect', ({ device }) => {
  console.log(`HID connected: ${device.productName}`);
  updateDeviceList();
});

navigator.hid.addEventListener('disconnect', ({ device }) => {
  console.log(`HID disconnected: ${device.productName}`);
  updateDeviceList();
});

document.addEventListener('DOMContentLoaded', async () => {
  devices = await navigator.hid.getDevices();
  openDevices();
  updateDeviceList();
});

const updateDeviceList = () => {
  document.querySelector('ul').innerHTML = devices
    .map((device) => {
      return `<li>${device.productName}${device.opened ? ' (ready)' : ''}</li>`;
    })
    .join('');
};

const openDevices = () => {
  devices.forEach(async (device) => {
    if (!device.opened) {
      await device.open();
    }
    device.addEventListener('inputreport', onInputReport);
  });
};

const onInputReport = (event) => {
  const { data, device, reportId } = event;
  console.log(device.productName, reportId, data);
  if (reportId !== 0x3f) {
    return;
  }
  const bytes = new Uint8Array(data.buffer).slice(0, 11).join();
  const button = BUTTON_MAPPING[device.productId][bytes];
  if (button) {
    const message = `User pressed button "${button.name}" on ${device.productName} (${device.productId}).`;
    button.element.classList.add('highlight');
    setTimeout(() => {
      button.element.classList.remove('highlight');
    }, 200);
    console.log(message);
  }
};

document.querySelector('button').addEventListener('click', async () => {
  // Filter on devices with the Nintendo Switch Joy-Con USB Vendor/Product IDs.
  const filters = [
    {
      vendorId: 0x057e, // Nintendo Co., Ltd
      productId: 0x2006, // Joy-Con Left
    },
    {
      vendorId: 0x057e, // Nintendo Co., Ltd
      productId: 0x2007, // Joy-Con Right
    },
  ];
  // Prompt user to select a Joy-Con device.
  try {
    const [device] = await navigator.hid.requestDevice({ filters });
    if (!device) {
      return;
    }
    if (
      !devices.find((knownDevice) => {
        return (
          knownDevice.productId === device.productId &&
          knownDevice.vendorId === device.vendorId
        );
      })
    ) {
      devices.push(device);
      updateDeviceList();
      openDevices();
    }
  } catch (error) {
    console.error(error.name, error.message);
  }
});
