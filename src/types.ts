export type PacketParserType = {
	_raw: Uint8Array<ArrayBuffer>;
	_hex: Uint8Array<ArrayBuffer>;
	level?: string;
	type?: string;
};

export type JoyConLastValues = {
	timestamp: number | null;
	alpha: number;
	beta: number;
	gamma: number;
};

export type Gyroscope = { x: number; y: number; z: number };
export type Accelerometer = { x: number; y: number; z: number };
export type Quaternion = { w: number; x: number; y: number; z: number };
export type LastValues = {
	alpha: number;
	beta: number;
	gamma: number;
	timestamp?: number;
};

export type ControllerTypeKey = 0x1 | 0x2 | 0x3;

export interface EulerAngles {
	heading: number; // Angle around Z-axis
	pitch: number; // Angle around Y-axis
	roll: number; // Angle around X-axis
}

export interface MadgwickOptions {
	beta?: number;
	doInitialisation?: boolean;
}

export interface SendReportAsyncFunctionOptions {
	subcommand: number[];
	expectedReport: Record<number, number>;
	timeoutErrorMessage?: string;
}
