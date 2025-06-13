import { Madgwick } from "./madgwick.ts";
import type { PacketParserType } from "./types.ts";

const leftMadgwick = Madgwick(10);
const rightMadgwick = Madgwick(10);
const rad2deg = 180.0 / Math.PI;

type Gyroscope = { x: number; y: number; z: number };
type Accelerometer = { x: number; y: number; z: number };
type Quaternion = { w: number; x: number; y: number; z: number };
type LastValues = {
	alpha: number;
	beta: number;
	gamma: number;
	timestamp?: number;
};

type ControllerTypeKey = 0x1 | 0x2 | 0x3;
const ControllerType: Record<ControllerTypeKey, string> = {
	1: "Left Joy-Con",
	2: "Right Joy-Con",
	3: "Pro Controller",
};

const bias = 0.75;
const zeroBias = 0.0125;
const scale = Math.PI / 2;

function baseSum<T>(
	array: T[],
	iteratee: (value: T) => number | undefined,
): number | undefined {
	let result: number | undefined;
	for (const value of array) {
		const current = iteratee(value);
		if (current !== undefined) {
			result = result === undefined ? current : result + current;
		}
	}
	return result;
}

function mean(array: number[]): number {
	return baseMean(array, (value) => value);
}

function baseMean<T>(array: T[], iteratee: (value: T) => number): number {
	const length = array == null ? 0 : array.length;
	return length ? (baseSum(array, iteratee) as number) / length : Number.NaN;
}

function calculateBatteryLevel(value: Uint8Array): string {
	let level: string;
	switch (value[0]) {
		case 8:
			level = "full";
			break;
		case 4:
			level = "medium";
			break;
		case 2:
			level = "low";
			break;
		case 1:
			level = "critical";
			break;
		case 0:
			level = "empty";
			break;
		default:
			level = "charging";
	}
	return level;
}

export function toEulerAngles(
	lastValues: LastValues,
	gyroscope: Gyroscope,
	accelerometer: Accelerometer,
	productId: number,
): { alpha: string; beta: string; gamma: string } {
	const now = Date.now();
	const dt = lastValues.timestamp ? (now - lastValues.timestamp) / 1000 : 0;
	lastValues.timestamp = now;
	const norm = Math.sqrt(
		accelerometer.x ** 2 + accelerometer.y ** 2 + accelerometer.z ** 2,
	);
	lastValues.alpha = (1 - zeroBias) * (lastValues.alpha + gyroscope.z * dt);
	if (norm !== 0) {
		lastValues.beta =
			bias * (lastValues.beta + gyroscope.x * dt) +
			(1.0 - bias) * ((accelerometer.x * scale) / norm);
		lastValues.gamma =
			bias * (lastValues.gamma + gyroscope.y * dt) +
			(1.0 - bias) * ((accelerometer.y * -scale) / norm);
	}
	return {
		alpha:
			productId === 0x2006
				? ((((-1 * (lastValues.alpha * 180)) / Math.PI) * 430) % 90).toFixed(6)
				: ((((lastValues.alpha * 180) / Math.PI) * 430) % 360).toFixed(6),
		beta: ((-1 * (lastValues.beta * 180)) / Math.PI).toFixed(6),
		gamma:
			productId === 0x2006
				? ((-1 * (lastValues.gamma * 180)) / Math.PI).toFixed(6)
				: ((lastValues.gamma * 180) / Math.PI).toFixed(6),
	};
}

export function toEulerAnglesQuaternion(q: Quaternion): {
	alpha: string;
	beta: string;
	gamma: string;
} {
	const ww = q.w * q.w;
	const xx = q.x * q.x;
	const yy = q.y * q.y;
	const zz = q.z * q.z;
	return {
		alpha: (
			rad2deg * Math.atan2(2 * (q.x * q.y + q.z * q.w), xx - yy - zz + ww)
		).toFixed(6),
		beta: (rad2deg * -Math.asin(2 * (q.x * q.z - q.y * q.w))).toFixed(6),
		gamma: (
			rad2deg * Math.atan2(2 * (q.y * q.z + q.x * q.w), -xx - yy + zz + ww)
		).toFixed(6),
	};
}

export function toQuaternion(
	gyro: Gyroscope,
	accl: Accelerometer,
	productId: number,
): Quaternion {
	if (productId === 0x2006) {
		leftMadgwick.update(gyro.x, gyro.y, gyro.z, accl.x, accl.y, accl.z);
		return leftMadgwick.getQuaternion();
	}
	rightMadgwick.update(gyro.x, gyro.y, gyro.z, accl.x, accl.y, accl.z);
	return rightMadgwick.getQuaternion();
}

function toAcceleration(value: Uint8Array): number {
	const view = new DataView(value.buffer);
	return Number.parseFloat((0.000244 * view.getInt16(0, true)).toFixed(6));
}

function toDegreesPerSecond(value: Uint8Array): number {
	const view = new DataView(value.buffer);
	return Number.parseFloat((0.06103 * view.getInt16(0, true)).toFixed(6));
}

function toRevolutionsPerSecond(value: Uint8Array): number {
	const view = new DataView(value.buffer);
	return Number.parseFloat((0.0001694 * view.getInt16(0, true)).toFixed(6));
}

export function parseDeviceInfo(rawData: Uint8Array, data: Uint8Array) {
	const bytes = rawData.slice(15, 15 + 11);
	const firmwareMajorVersionRaw = bytes.slice(0, 1)[0]; // index 0
	const firmwareMinorVersionRaw = bytes.slice(1, 2)[0]; // index 1
	const typeRaw = bytes.slice(2, 3); // index 2
	const macAddressRaw = bytes.slice(4, 10); // index 4-9
	const macAddress: string[] = [];

	for (const number of macAddressRaw) {
		macAddress.push(number.toString(16));
	}

	const spiColorInUseRaw = bytes.slice(11, 12); // index 11

	const result = {
		_raw: bytes.slice(0, 12),
		_hex: bytes.slice(0, 12),
		firmwareVersion: {
			major: firmwareMajorVersionRaw,
			minor: firmwareMinorVersionRaw,
		},
		type: ControllerType[typeRaw[0] as ControllerTypeKey],
		macAddress: macAddress.join(":"),
		spiColorInUse: spiColorInUseRaw[0] === 0x1,
	};
	return result;
}

export function parseInputReportID(rawData: Uint8Array, data: Uint8Array) {
	const inputReportID = {
		_raw: rawData.slice(0, 1), // index 0
		_hex: data.slice(0, 1),
	};
	return inputReportID;
}

export function parseTimer(rawData: Uint8Array, data: Uint8Array) {
	const timer = {
		_raw: rawData.slice(1, 2), // index 1
		_hex: data.slice(1, 2),
	};
	return timer;
}

export function parseBatteryLevel(rawData: Uint8Array, data: Uint8Array) {
	const batteryLevel: PacketParserType = {
		_raw: rawData.slice(2, 3), // high nibble
		_hex: data.slice(2, 3),
		level: calculateBatteryLevel(data.slice(2, 3)),
	};
	return batteryLevel;
}

export function parseConnectionInfo(rawData: Uint8Array, data: Uint8Array) {
	const connectionInfo = {
		_raw: rawData.slice(2, 3), // low nibble
		_hex: data.slice(2, 3),
	};
	return connectionInfo;
}

export function parseButtonStatus(rawData: Uint8Array, data: Uint8Array) {
	const buttonStatus = {
		_raw: rawData.slice(1, 3), // index 1,2
		_hex: data.slice(1, 3),
	};
	return buttonStatus;
}

export function parseCompleteButtonStatus(
	rawData: Uint8Array,
	data: Uint8Array,
) {
	const buttonStatus = {
		_raw: rawData.slice(3, 6), // index 3,4,5
		_hex: data.slice(3, 6),
		// Byte 3 (Right Joy-Con)
		y: Boolean(0x01 & rawData[3]),
		x: Boolean(0x02 & rawData[3]),
		b: Boolean(0x04 & rawData[3]),
		a: Boolean(0x08 & rawData[3]),
		r: Boolean(0x40 & rawData[3]),
		zr: Boolean(0x80 & rawData[3]),
		// Byte 5 (Left Joy-Con)
		down: Boolean(0x01 & rawData[5]),
		up: Boolean(0x02 & rawData[5]),
		right: Boolean(0x04 & rawData[5]),
		left: Boolean(0x08 & rawData[5]),
		l: Boolean(0x40 & rawData[5]),
		zl: Boolean(0x80 & rawData[5]),
		// Byte 3,5 (Shared)
		sr: Boolean(0x10 & rawData[3]) || Boolean(0x10 & rawData[5]),
		sl: Boolean(0x20 & rawData[3]) || Boolean(0x20 & rawData[5]),
		// Byte 4 (Shared)
		minus: Boolean(0x01 & rawData[4]),
		plus: Boolean(0x02 & rawData[4]),
		rightStick: Boolean(0x04 & rawData[4]),
		leftStick: Boolean(0x08 & rawData[4]),
		home: Boolean(0x10 & rawData[4]),
		capture: Boolean(0x20 & rawData[4]),
		chargingGrip: Boolean(0x80 & rawData[4]),
	};
	return buttonStatus;
}

export function parseAnalogStick(rawData: Uint8Array, data: Uint8Array) {
	const analogStick = {
		_raw: rawData.slice(3, 4), // index 3
		_hex: data.slice(3, 4),
	};
	return analogStick;
}

export function parseAnalogStickLeft(rawData: Uint8Array, data: Uint8Array) {
	let horizontal = rawData[6] | ((rawData[7] & 0xf) << 8);
	horizontal = (horizontal / 1995 - 1) * 2;
	let vertical = ((rawData[7] >> 4) | (rawData[8] << 4)) * -1;
	vertical = (vertical / 2220 + 1) * 2;
	const analogStickLeft = {
		_raw: rawData.slice(6, 9), // index 6,7,8
		_hex: data.slice(6, 9),
		horizontal: horizontal.toFixed(1),
		vertical: vertical.toFixed(1),
	};
	return analogStickLeft;
}

export function parseAnalogStickRight(rawData: Uint8Array, data: Uint8Array) {
	let horizontal = rawData[9] | ((rawData[10] & 0xf) << 8);
	horizontal = (horizontal / 1995 - 1) * 2;
	let vertical = ((rawData[10] >> 4) | (rawData[11] << 4)) * -1;
	vertical = (vertical / 2220 + 1) * 2;
	const analogStickRight = {
		_raw: rawData.slice(9, 12), // index 9,10,11
		_hex: data.slice(9, 12),
		horizontal: horizontal.toFixed(1),
		vertical: vertical.toFixed(1),
	};
	return analogStickRight;
}

export function parseFilter(rawData: Uint8Array, data: Uint8Array) {
	const filter = {
		_raw: rawData.slice(4), // index 4
		_hex: data.slice(4),
	};
	return filter;
}

export function parseRingCon(rawData: Uint8Array, data: Uint8Array) {
	const ringcon = {
		_raw: rawData.slice(38, 40),
		_hex: data.slice(38, 40),
		strain: new DataView(rawData.buffer, 39, 2).getInt16(0, true),
	};
	return ringcon;
}
