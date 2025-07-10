export type ParsedPacketData = {
  _raw: Uint8Array;
  _hex: string | Uint8Array;
};

export type RingConDataPacket = {
  strain: number;
};

export type AccelerometerData = {
  x: ParsedPacketData & AccelerometerPacket;
  y: ParsedPacketData & AccelerometerPacket;
  z: ParsedPacketData & AccelerometerPacket;
};

export type JoyConLastValues = {
  timestamp: number | null;
  alpha: number;
  beta: number;
  gamma: number;
};

export type RawJoyConDataPacket = {
  inputReportID: ParsedPacketData;
  filter: ParsedPacketData;
  timer: ParsedPacketData;
  connectionInfo: ParsedPacketData;
  vibrator: ParsedPacketData;
  ack: ParsedPacketData;
  subcommandID: ParsedPacketData;
  subcommandReplyData: ParsedPacketData;
};

export type CompleteJoyConData = {
  accelerometers: AccelerometerData[];
  actualAccelerometer: {
    x: number;
    y: number;
    z: number;
  };
  actualOrientationQuaternion: {
    alpha: string;
    beta: string;
    gamma: string;
  };
  quaternion: Quaternion;
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
  ringCon: RingConDataPacket & ParsedPacketData;
  deviceInfo: DeviceInfo & ParsedPacketData;
};

export type CompleteJoyConDataPacket = {
  buttonStatus: CompleteButtonStatus;
  analogStick: AnalogStick;
  batteryLevel: BatteryLevel;
  analogStickLeft: AnalogStick;
  analogStickRight: AnalogStick;
  gyroscopes: GyroscopePacket[][];
} & RawJoyConDataPacket &
  CompleteJoyConData;

export type ParsedJoyconPacketData = {
  buttonStatus: ParsedPacketData;
  analogStick: ParsedPacketData;
  batteryLevel: ParsedPacketData;
  analogStickLeft: ParsedPacketData;
  analogStickRight: ParsedPacketData;
  gyroscopes: ParsedPacketData[][];
} & RawJoyConDataPacket &
  CompleteJoyConData;

export type Gyroscope = { x: number; y: number; z: number };
export type Accelerometer = { x: number; y: number; z: number };
export type Quaternion = { w: number; x: number; y: number; z: number };

export type ControllerTypeKey = 0x1 | 0x2 | 0x3;

export interface SendReportAsyncFunctionOptions {
  subcommand: number[];
  expectedReport: Record<number, number>;
  timeoutErrorMessage?: string;
}

export type JoyConEvents = {
  hidinput: CustomEvent<ParsedJoyconPacketData | CompleteJoyConDataPacket>;
  deviceinfo: CustomEvent<ParsedJoyconPacketData | CompleteJoyConDataPacket>;
  batterylevel: CustomEvent<ParsedJoyconPacketData | CompleteJoyConDataPacket>;
};

export type CompleteButtonStatus = {
  y: boolean;
  x: boolean;
  b: boolean;
  a: boolean;
  r: boolean;
  zr: boolean;
  // Byte 5 (Left Joy-Con)
  down: boolean;
  up: boolean;
  right: boolean;
  left: boolean;
  l: boolean;
  zl: boolean;
  // Byte 3,5 (Shared)
  sr: boolean;
  sl: boolean;
  // Byte 4 (Shared)
  minus: boolean;
  plus: boolean;
  rightStick: boolean;
  leftStick: boolean;
  home: boolean;
  capture: boolean;
  chargingGrip: boolean;
};

export type DeviceInfo = {
  firmwareVersion: {
    major: number;
    minor: number;
  };
  type: string;
  macAddress: string;
  spiColorInUse: boolean;
};

export type BatteryLevel = {
  level: string;
};

export type AccelerometerPacket = {
  acc: number;
};

export type GyroscopePacket = {
  dps: number;
  rps: number;
};

export type AnalogStick = {
  horizontal: string;
  vertical: string;
};
