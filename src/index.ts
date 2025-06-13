import { GeneralController, JoyConLeft, JoyConRight } from "./joycon.js";

const connectedJoyCons = new Map<
	number,
	JoyConLeft | JoyConRight | GeneralController
>();
const devices: HIDDevice[] = [];

const getDeviceID = (device: HIDDevice): number => {
	const n = devices.indexOf(device);
	if (n >= 0) {
		return n;
	}
	devices.push(device);
	return devices.length - 1;
};

const addDevice = async (device: HIDDevice) => {
	const id = getDeviceID(device);
	console.log(
		`HID connected: ${id} ${device.productId.toString(16)} ${device.productName}`,
	);
	connectedJoyCons.set(id, await connectDevice(device));
};

const removeDevice = async (device: HIDDevice) => {
	const id = getDeviceID(device);
	console.log(
		`HID disconnected: ${id} ${device.productId.toString(16)} ${device.productName}`,
	);
	connectedJoyCons.delete(id);
};

navigator.hid.addEventListener("connect", async ({ device }) => {
	addDevice(device);
});

navigator.hid.addEventListener("disconnect", ({ device }) => {
	removeDevice(device);
});

document.addEventListener("DOMContentLoaded", async () => {
	const devices = await navigator.hid.getDevices();

	for (const device of devices) {
		await addDevice(device);
	}
});

const connectJoyCon = async (): Promise<void> => {
	// Filter on devices with the Nintendo Vendor ID.
	const filters = [
		{
			vendorId: 0x057e, // Nintendo Co., Ltd
		},
	];
	// Prompt user to select a Joy-Con device.
	try {
		const devices = await navigator.hid.requestDevice({ filters });
		const device = devices[0];

		if (!device) {
			return;
		}

		await addDevice(device);
	} catch (error) {
		console.error(error.name, error.message);
	}
};

const connectDevice = async (
	device: HIDDevice,
): Promise<JoyConLeft | JoyConRight | GeneralController> => {
	let joyCon: JoyConLeft | JoyConRight | GeneralController | null = null;
	if (device.productId === 0x2006) {
		joyCon = new JoyConLeft(device);
	} else if (device.productId === 0x2007) {
		if (device.productName === "Joy-Con (R)") {
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

export {
	connectJoyCon,
	connectedJoyCons,
	JoyConLeft,
	JoyConRight,
	GeneralController,
};
