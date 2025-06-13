export type PacketParserType = {
	_raw: Uint8Array<ArrayBuffer>;
	_hex: string | Uint8Array<ArrayBuffer>;
	dps?: number;
	rps?: number;
	acc?: number;
	level?: string;
	type?: string;
	strain?: number;
};

export type AccelerometerData = {
	x: PacketParserType;
	y: PacketParserType;
	z: PacketParserType;
};

export type JoyConLastValues = {
	timestamp?: number;
	alpha: number;
	beta: number;
	gamma: number;
};

export type PacketType = {
	inputReportID: PacketParserType;
	buttonStatus: PacketParserType;
	analogStick: PacketParserType;
	filter: PacketParserType;
	timer: PacketParserType;
	batteryLevel: PacketParserType;
	connectionInfo: PacketParserType;
	analogStickLeft: PacketParserType;
	analogStickRight: PacketParserType;
	vibrator: PacketParserType;
	ack: PacketParserType;
	subcommandID: PacketParserType;
	subcommandReplyData: PacketParserType;
	deviceInfo: PacketParserType;
	accelerometers: AccelerometerData[];
	actualAccelerometer: {
		x: number;
		y: number;
		z: number;
	};
	gyroscopes: PacketParserType[][];
	actualGyroscope: {
		dps: {
			x: number;
			y: number;
			z: number;
		};
		rps: {
			x: number;
			y: number;
			z: number;
		};
	};
	actualOrientation: {
		alpha: string;
		beta: string;
		gamma: string;
	};
	actualOrientationQuaternion: {
		alpha: string;
		beta: string;
		gamma: string;
	};
	quaternion: Quaternion;
	ringCon: PacketParserType;
};

export type Gyroscope = { x: number; y: number; z: number };
export type Accelerometer = { x: number; y: number; z: number };
export type Quaternion = { w: number; x: number; y: number; z: number };

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
