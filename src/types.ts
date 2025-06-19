export type ParsedPacketData = {
  _raw: Uint8Array;
  _hex: string | Uint8Array;
  dps: number;
  rps: number;
  acc: number;
  level: string;
  type: string;
  strain: number;
};

export type AccelerometerData = {
  x: Partial<ParsedPacketData>;
  y: Partial<ParsedPacketData>;
  z: Partial<ParsedPacketData>;
};

export type JoyConLastValues = {
  timestamp: number | null;
  alpha: number;
  beta: number;
  gamma: number;
};

export type JoyConDataPacket = {
  inputReportID: Partial<ParsedPacketData>;
  buttonStatus: Partial<ParsedPacketData> & CompleteButtonStatus;
  analogStick: Partial<ParsedPacketData>;
  filter: Partial<ParsedPacketData>;
  timer: Partial<ParsedPacketData>;
  batteryLevel: Partial<ParsedPacketData>;
  connectionInfo: Partial<ParsedPacketData>;
  analogStickLeft: Partial<ParsedPacketData>;
  analogStickRight: Partial<ParsedPacketData>;
  vibrator: Partial<ParsedPacketData>;
  ack: Partial<ParsedPacketData>;
  subcommandID: Partial<ParsedPacketData>;
  subcommandReplyData: Partial<ParsedPacketData>;
  deviceInfo: Partial<ParsedPacketData>;
  accelerometers: AccelerometerData[];
  actualAccelerometer: {
    x: number;
    y: number;
    z: number;
  };
  gyroscopes: Partial<ParsedPacketData>[][];
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
  ringCon: Partial<ParsedPacketData>;
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
  beta: number;
  doInitialisation: boolean;
}

export interface SendReportAsyncFunctionOptions {
  subcommand: number[];
  expectedReport: Record<number, number>;
  timeoutErrorMessage?: string;
}

export type JoyConEvents = {
  hidinput: CustomEvent<JoyConDataPacket>;
  deviceinfo: CustomEvent<JoyConDataPacket>;
  batterylevel: CustomEvent<JoyConDataPacket>;
};

export type Madgwick = {
  update: (
    gx: number,
    gy: number,
    gz: number,
    ax: number,
    ay: number,
    az: number,
    mx?: number,
    my?: number,
    mz?: number,
    deltaTimeSec?: number
  ) => void;
  init: (
    ax: number,
    ay: number,
    az: number,
    mx: number,
    my: number,
    mz: number
  ) => void;
  getQuaternion(): Quaternion;
};

export type CompleteButtonStatus = {
  _raw: Uint8Array<ArrayBuffer>;
  _hex: string | Uint8Array<ArrayBuffer>;
  // Byte 3 (Right Joy-Con)
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
