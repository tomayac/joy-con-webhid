import { JoyConLeft, JoyConRight, GeneralController } from './joycon.js';

const connectedJoyCons = new Map();
const devices = [];

const getDeviceID = (device) => {
  const n = devices.indexOf(device);
  if (n >= 0) {
    return n;
  }
  devices.push(device);
  return devices.length - 1;
};

const addDevice = async (device) => {
  const id = getDeviceID(device);
  console.log(`HID connected: ${id} ${device.productName}`);
  connectedJoyCons.set(id, await connectDevice(device));
};

const removeDevice = async (device) => {
  const id = getDeviceID(device);
  console.log(`HID disconnected: ${id} ${device.productName}`);
  connectedJoyCons.delete(id);
};

navigator.hid.addEventListener('connect', async ({ device }) => {
  addDevice(device);
});

navigator.hid.addEventListener('disconnect', ({ device }) => {
  removeDevice(device);
});

document.addEventListener('DOMContentLoaded', async () => {
  const devices = await navigator.hid.getDevices();
  devices.forEach(async (device) => {
    await addDevice(device);
  });
});

const connectJoyCon = async () => {
  // Filter on devices with the Nintendo Vendor ID.
  const filters = [
    {
      vendorId: 0x057e, // Nintendo Co., Ltd
    },
  ];
  /*
  // Filter on devices with the Nintendo Switch Joy-Con USB Vendor/Product IDs.
  const filters = {
    {
      vendorId: 0x057e, // Nintendo Co., Ltd
      productId: 0x2006, // Joy-Con Left
    },
    {
      vendorId: 0x057e, // Nintendo Co., Ltd
      productId: 0x2007, // Joy-Con Right
    },
    {
      vendorId: 0x057e, // Nintendo Co., Ltd
      productId: 0x2017, // SNES Controller, MD/Gen Control Pad
    },
    {
      vendorId: 0x057e, // Nintendo Co., Ltd
      productId: 0x2009, // ProCon
    },
    {
      vendorId: 0x057e, // Nintendo Co., Ltd
      productId: 0x2019, // N64 Controller
    },
  ];
  */
  // Prompt user to select a Joy-Con device.
  try {
    const [device] = await navigator.hid.requestDevice({ filters });
    if (!device) {
      return;
    }
    await addDevice(device);
  } catch (error) {
    console.error(error.name, error.message);
  }
};

const connectDevice = async (device) => {
  let joyCon = null;
  if (device.productId === 0x2006) {
    joyCon = new JoyConLeft(device);
  } else if (device.productId === 0x2007) {
    if (device.productName === 'Joy-Con (R)') {
      joyCon = new JoyConRight(device);
    }
  }
  if (!joyCon) {
    //console.log(device.productId.toString(16), device.productName);
    joyCon = new GeneralController(device); // for other controllers
  }
  await joyCon.open();
  await joyCon.enableStandardFullMode();
  await joyCon.enableIMUMode();
  return joyCon;
};

export {
  connectJoyCon,
  connectedJoyCons,
  JoyConLeft,
  JoyConRight,
  GeneralController,
};
