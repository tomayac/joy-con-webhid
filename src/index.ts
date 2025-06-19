import { GeneralController, JoyConLeft, JoyConRight } from './joycon.ts';
export * from './types.ts';

/**
 * Connects to a HID device and initializes it as a Joy-Con controller or general controller.
 *
 * This function identifies the device type based on its product ID and creates the appropriate
 * controller instance. It then opens the device connection and enables various controller modes
 * including USB HID joystick reporting, standard full mode, and IMU (Inertial Measurement Unit) mode.
 *
 * @param device - The HID device to connect to
 * @returns A Promise that resolves to the connected and configured controller instance
 *
 * @remarks
 * - Product ID 0x2006 is identified as a Joy-Con Left controller
 * - Product ID 0x2007 with product name "Joy-Con (R)" is identified as a Joy-Con Right controller
 * - All other devices are treated as general controllers
 *
 * @example
 * ```typescript
 * const hidDevice = await navigator.hid.requestDevice({
 *   filters: [{ vendorId: 0x057e }]
 * });
 * const controller = await connectDevice(hidDevice);
 * ```
 */
const connectDevice = async (
  device: HIDDevice
): Promise<JoyConLeft | JoyConRight | GeneralController> => {
  let joyCon: JoyConLeft | JoyConRight | GeneralController | null = null;
  if (device.productId === 0x2006) {
    joyCon = new JoyConLeft(device);
  } else if (device.productId === 0x2007) {
    if (device.productName === 'Joy-Con (R)') {
      joyCon = new JoyConRight(device);
    }
  }
  if (!joyCon) {
    joyCon = new GeneralController(device); // for other controllers
  }
  await joyCon.open();
  await joyCon.enableUSBHIDJoystickReport();
  await joyCon.enableStandardFullMode();
  await joyCon.enableIMUMode();
  return joyCon;
};

const connectedJoyCons = new Map<
  number,
  JoyConLeft | JoyConRight | GeneralController
>();
const devices: HIDDevice[] = [];

/**
 * Retrieves the unique ID for a given HIDDevice from the `devices` array.
 * If the device is already present, returns its existing index.
 * Otherwise, adds the device to the array and returns its new index.
 *
 * @param device - The HIDDevice for which to obtain an ID.
 * @returns The index of the device in the `devices` array, used as its unique ID.
 */
const getDeviceID = (device: HIDDevice): number => {
  const n = devices.indexOf(device);
  if (n >= 0) {
    return n;
  }
  devices.push(device);
  return devices.length - 1;
};

/**
 * Adds a HID device to the connected Joy-Cons map after establishing a connection.
 *
 * This function generates a unique device ID, logs the connection event,
 * and stores the connected device in the `connectedJoyCons` map.
 *
 * @param device - The HIDDevice instance to be added and connected.
 * @returns A promise that resolves when the device has been connected and added.
 */
const addDevice = async (device: HIDDevice) => {
  const id = getDeviceID(device);
  console.log(
    `HID connected: ${id} ${device.productId.toString(16)} ${device.productName}`
  );
  connectedJoyCons.set(id, await connectDevice(device));
};

/**
 * Removes a Joy-Con device from the connected devices collection.
 *
 * @param device - The HID device to remove from the connected Joy-Cons
 * @returns A promise that resolves when the device has been successfully removed
 *
 * @remarks
 * This function logs the disconnection event with device details including ID,
 * product ID (in hexadecimal), and product name before removing the device
 * from the connectedJoyCons collection.
 */
const removeDevice = async (device: HIDDevice) => {
  const id = getDeviceID(device);
  console.log(
    `HID disconnected: ${id} ${device.productId.toString(16)} ${device.productName}`
  );
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

  for (const device of devices) {
    await addDevice(device);
  }
});

/**
 * Prompts the user to select and connect a Joy-Con device using the WebHID API.
 *
 * This function filters for Nintendo devices (vendor ID 0x057e) and allows the user
 * to select a Joy-Con controller from the available devices. Once selected, the device
 * is added to the application for further use.
 *
 * @returns A Promise that resolves when the connection process completes successfully,
 *          or rejects if an error occurs during device selection or connection.
 *
 * @throws Will log errors to console if device selection fails or if the addDevice
 *         operation encounters an error.
 *
 * @example
 * ```typescript
 * await connectJoyCon();
 * ```
 */
const connectJoyCon = async (): Promise<void> => {
  // Filter on devices with the Nintendo Vendor ID.
  const filters = [
    {
      vendorId: 0x057e, // Nintendo Co., Ltd
    },
  ];

  // Prompt user to select a Joy-Con device.
  try {
    const [chosenDevice] = await navigator.hid.requestDevice({ filters });

    if (!chosenDevice) {
      return;
    }

    await addDevice(chosenDevice);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.name, error.message);
    } else {
      console.error(error);
    }
  }
};

export {
  connectJoyCon,
  connectedJoyCons,
  JoyConLeft,
  JoyConRight,
  GeneralController,
};
