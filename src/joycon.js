import * as PacketParser from './parse.js';
import { connectRingCon } from './connectRingCon.js';

/**
 * Concatenates two typed arrays.
 *
 * @param {Uint8Array} a
 * @param {Uint8Array} b
 * @return {Uint8Array}
 */
const concatTypedArrays = (a, b) => {
  const c = new a.constructor(a.length + b.length);
  c.set(a, 0);
  c.set(b, a.length);
  return c;
};

/**
 *
 *
 * @class JoyCon
 * @extends {EventTarget}
 */
class JoyCon extends EventTarget {
  /**
   * Creates an instance of JoyCon.
   *
   * @param {HIDDevice} device
   * @memberof JoyCon
   */
  constructor(device) {
    super();
    this.device = device;
    this.lastValues = {
      timestamp: null,
      alpha: 0,
      beta: 0,
      gamma: 0,
    };
  }

  /**
   * Opens the device.
   *
   * @memberof JoyCon
   */
  async open() {
    if (!this.device.opened) {
      await this.device.open();
    }
    this.device.addEventListener('inputreport', this._onInputReport.bind(this));
  }

  /**
   * Requests information about the device.
   *
   * @memberof JoyCon
   */
  async getRequestDeviceInfo() {
    const outputReportID = 0x01;
    const subcommand = [0x02];
    const data = [
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      ...subcommand,
    ];
    let result = new Promise((resolve) => {
      const onDeviceInfo = ({ detail: deviceInfo }) => {
        this.removeEventListener('deviceinfo', onDeviceInfo);
        delete deviceInfo._raw;
        delete deviceInfo._hex;
        resolve(deviceInfo);
      };
      this.addEventListener('deviceinfo', onDeviceInfo);
    });
    await this.device.sendReport(outputReportID, new Uint8Array(data));

    return result;
  }

  /**
   * Requests information about the battery.
   *
   * @memberof JoyCon
   */
  async getBatteryLevel() {
    const outputReportID = 0x01;
    const subCommand = [0x50];
    const data = [
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      ...subCommand,
    ];

    let result = new Promise((resolve) => {
      const onBatteryLevel = ({ detail: batteryLevel }) => {
        this.removeEventListener('batterylevel', onBatteryLevel);
        delete batteryLevel._raw;
        delete batteryLevel._hex;
        resolve(batteryLevel);
      };
      this.addEventListener('batterylevel', onBatteryLevel);
    });
    await this.device.sendReport(outputReportID, new Uint8Array(data));
    return result;
  }

  /**
   * Enables simple HID mode.
   *
   * @memberof JoyCon
   */
  async enableSimpleHIDMode() {
    const outputReportID = 0x01;
    const subcommand = [0x03, 0x3f];
    const data = [
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      ...subcommand,
    ];
    await this.device.sendReport(outputReportID, new Uint8Array(data));
  }

  /**
   * Enables standard full mode.
   *
   * @memberof JoyCon
   */
  async enableStandardFullMode() {
    const outputReportID = 0x01;
    const subcommand = [0x03, 0x30];
    const data = [
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      ...subcommand,
    ];
    await this.device.sendReport(outputReportID, new Uint8Array(data));
  }

  /**
   * Enables EMU mode.
   *
   * @memberof JoyCon
   */
  async enableIMUMode() {
    const outputReportID = 0x01;
    const subcommand = [0x40, 0x01];
    const data = [
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      ...subcommand,
    ];
    await this.device.sendReport(outputReportID, new Uint8Array(data));
  }

  /**
   * Disables IMU mode.
   *
   * @memberof JoyCon
   */
  async disableIMUMode() {
    const outputReportID = 0x01;
    const subcommand = [0x40, 0x00];
    const data = [
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      ...subcommand,
    ];
    await this.device.sendReport(outputReportID, new Uint8Array(data));
  }

  /**
   * Enables vibration.
   *
   * @memberof JoyCon
   */
  async enableVibration() {
    const outputReportID = 0x01;
    const subcommand = [0x48, 0x01];
    const data = [
      0x00,
      0x00,
      0x01,
      0x40,
      0x40,
      0x00,
      0x01,
      0x40,
      0x40,
      ...subcommand,
    ];
    await this.device.sendReport(outputReportID, new Uint8Array(data));
  }

  /**
   * Disables vibration.
   *
   * @memberof JoyCon
   */
  async disableVibration() {
    const outputReportID = 0x01;
    const subcommand = [0x48, 0x00];
    const data = [
      0x00,
      0x00,
      0x01,
      0x40,
      0x40,
      0x00,
      0x01,
      0x40,
      0x40,
      ...subcommand,
    ];
    await this.device.sendReport(outputReportID, new Uint8Array(data));
  }

  /**
   * Enables RingCon.
   *
   * @memberof JoyCon
   * @seeAlso https://github.com/mascii/demo-of-ring-con-with-web-hid
   */
  async enableRingCon() {
    /*
    const cmds = [
      [0x22, 0x01], // enabling_MCU_data_22_1
      [0x21, 0x21, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xF3
      ], // enabling_MCU_data_21_21_1_1
      [0x59], // get_ext_data_59
      [0x5C, 0x06, 0x03, 0x25, 0x06, 0x00, 0x00, 0x00, 0x00, 0x1C, 0x16, 0xED, 0x34, 0x36,
        0x00, 0x00, 0x00, 0x0A, 0x64, 0x0B, 0xE6, 0xA9, 0x22, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x90, 0xA8, 0xE1, 0x34, 0x36
      ], // get_ext_dev_in_format_config_5C
      [0x5A, 0x04, 0x01, 0x01, 0x02], // start_external_polling_5A
    ];
    for (const subcommand of cmds) {
      await this.device.sendReport(0x01, new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, ...subcommand
      ]));
    }
    */
    await connectRingCon(this.device);
  }

  /**
   * Enables USB HID Joystick report
   *
   * @memberof JoyCon
   */
  async enableUSBHIDJoystickReport() {
    const usb =
      this.device.collections[0].outputReports.find(
        (r) => r.reportId == 0x80
      ) != null;
    if (usb) {
      await this.device.sendReport(0x80, new Uint8Array([0x01]));
      await this.device.sendReport(0x80, new Uint8Array([0x02]));
      await this.device.sendReport(0x01, new Uint8Array([0x03]));
      await this.device.sendReport(0x80, new Uint8Array([0x04]));
    }
  }

  /**
   * Send a rumble signal to Joy-Con.
   *
   * @param {number} lowFrequency
   * @param {number} highFrequency
   * @param {number} amplitude
   *
   * @memberof JoyCon
   */
  async rumble(lowFrequency, highFrequency, amplitude) {
    const clamp = (value, min, max) => {
      return Math.min(Math.max(value, min), max);
    };
    const outputReportID = 0x10;
    const data = new Uint8Array(9);

    // Referenced codes below:
    // https://github.com/Looking-Glass/JoyconLib/blob/master/Packages/com.lookingglass.joyconlib/JoyconLib_scripts/Joycon.cs
    data[0] = 0x00;

    let lf = clamp(lowFrequency, 40.875885, 626.286133);
    let hf = clamp(highFrequency, 81.75177, 1252.572266);

    hf = (Math.round(32 * Math.log2(hf * 0.1)) - 0x60) * 4;
    lf = Math.round(32 * Math.log2(lf * 0.1)) - 0x40;

    const amp = clamp(amplitude, 0, 1);

    let hfAmp;
    if (amp == 0) {
      hfAmp = 0;
    } else if (amp < 0.117) {
      hfAmp = (Math.log2(amp * 1000) * 32 - 0x60) / (5 - Math.pow(amp, 2)) - 1;
    } else if (amp < 0.23) {
      hfAmp = Math.log2(amp * 1000) * 32 - 0x60 - 0x5c;
    } else {
      hfAmp = (Math.log2(amp * 1000) * 32 - 0x60) * 2 - 0xf6;
    }

    let lfAmp = Math.round(hfAmp) * 0.5;
    const parity = lfAmp % 2;
    if (parity > 0) {
      --lfAmp;
    }
    lfAmp = lfAmp >> 1;
    lfAmp += 0x40;
    if (parity > 0) {
      lfAmp |= 0x8000;
    }

    data[1] = hf & 0xff;
    data[2] = hfAmp + ((hf >>> 8) & 0xff);
    data[3] = lf + ((lfAmp >>> 8) & 0xff);
    data[4] += lfAmp & 0xff;

    for (let i = 0; i < 4; i++) {
      data[5 + i] = data[1 + i];
    }

    await this.device.sendReport(outputReportID, new Uint8Array(data));
  }

  /**
   * set LED state.
   * @param {int} n position(0-3)
   *
   * @memberof JoyCon
   */
  async setLEDState(n) {
    const NO_RUMBLE = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
    const subcommand = [0x30, n];
    await this.device.sendReport(
      0x01,
      new Uint8Array([...NO_RUMBLE, 0, ...subcommand])
    );
  }

  /**
   * set LED.
   *
   * @memberof JoyCon
   * @param {int} n position(0-3)
   */
  async setLED(n) {
    this.ledstate |= 1 << n;
    await this.setLEDState(this.ledstate);
  }

  /**
   * reset LED.
   *
   * @memberof JoyCon
   * @param {int} n position(0-3)
   */
  async resetLED(n) {
    this.ledstate &= ~((1 << n) | (1 << (4 + n)));
    await this.setLEDState(this.ledstate);
  }

  /**
   * blink LED.
   *
   * @memberof JoyCon
   * @param {int} n position(0-3)
   */
  async blinkLED(n) {
    this.ledstate &= ~(1 << n);
    this.ledstate |= 1 << (4 + n);
    await this.setLEDState(this.ledstate);
  }

  /**
   * Deal with `oninputreport` events.
   *
   * @param {*} event
   * @memberof JoyCon
   */
  _onInputReport(event) {
    let { data, reportId, device } = event;

    if (!data) {
      return;
    }

    data = concatTypedArrays(
      new Uint8Array([reportId]),
      new Uint8Array(data.buffer)
    );
    const hexData = data.map((byte) => byte.toString(16));

    let packet = {
      inputReportID: PacketParser.parseInputReportID(data, hexData),
    };

    switch (reportId) {
      case 0x3f: {
        packet = {
          ...packet,
          buttonStatus: PacketParser.parseButtonStatus(data, hexData),
          analogStick: PacketParser.parseAnalogStick(data, hexData),
          filter: PacketParser.parseFilter(data, hexData),
        };
        break;
      }
      case 0x21:
      case 0x30: {
        packet = {
          ...packet,
          timer: PacketParser.parseTimer(data, hexData),
          batteryLevel: PacketParser.parseBatteryLevel(data, hexData),
          connectionInfo: PacketParser.parseConnectionInfo(data, hexData),
          buttonStatus: PacketParser.parseCompleteButtonStatus(data, hexData),
          analogStickLeft: PacketParser.parseAnalogStickLeft(data, hexData),
          analogStickRight: PacketParser.parseAnalogStickRight(data, hexData),
          vibrator: PacketParser.parseVibrator(data, hexData),
        };

        if (reportId === 0x21) {
          packet = {
            ...packet,
            ack: PacketParser.parseAck(data, hexData),
            subcommandID: PacketParser.parseSubcommandID(data, hexData),
            subcommandReplyData: PacketParser.parseSubcommandReplyData(
              data,
              hexData
            ),
            deviceInfo: PacketParser.parseDeviceInfo(data, hexData),
          };
        }

        if (reportId === 0x30) {
          const accelerometers = PacketParser.parseAccelerometers(
            data,
            hexData
          );
          const gyroscopes = PacketParser.parseGyroscopes(data, hexData);
          const rps = PacketParser.calculateActualGyroscope(
            gyroscopes.map((g) => g.map((v) => v.rps))
          );
          const dps = PacketParser.calculateActualGyroscope(
            gyroscopes.map((g) => g.map((v) => v.dps))
          );
          const acc = PacketParser.calculateActualAccelerometer(
            accelerometers.map((a) => [a.x.acc, a.y.acc, a.z.acc])
          );
          const quaternion = PacketParser.toQuaternion(
            rps,
            acc,
            device.productId
          );

          packet = {
            ...packet,
            accelerometers,
            gyroscopes,
            actualAccelerometer: acc,
            actualGyroscope: {
              dps: dps,
              rps: rps,
            },
            actualOrientation: PacketParser.toEulerAngles(
              this.lastValues,
              rps,
              acc,
              device.productId
            ),
            actualOrientationQuaternion:
              PacketParser.toEulerAnglesQuaternion(quaternion),
            quaternion: quaternion,
            ringCon: PacketParser.parseRingCon(data, hexData),
          };
        }
        break;
      }
    }
    if (packet.deviceInfo?.type) {
      this._receiveDeviceInfo(packet.deviceInfo);
    }
    if (packet.batteryLevel?.level) {
      this._receiveBatteryLevel(packet.batteryLevel);
    }
    this._receiveInputEvent(packet);
  }

  /**
   *
   *
   * @param {*} deviceInfo
   * @memberof JoyCon
   */
  _receiveDeviceInfo(deviceInfo) {
    this.dispatchEvent(new CustomEvent('deviceinfo', { detail: deviceInfo }));
  }

  /**
   *
   *
   * @param {*} batteryLevel
   * @memberof JoyCon
   */
  _receiveBatteryLevel(batteryLevel) {
    this.dispatchEvent(
      new CustomEvent('batterylevel', { detail: batteryLevel })
    );
  }
}

/**
 *
 *
 * @class JoyConLeft
 * @extends {JoyCon}
 */
class JoyConLeft extends JoyCon {
  /**
   * Creates an instance of JoyConLeft.
   * @param {HIDDevice} device
   * @memberof JoyConLeft
   */
  constructor(device) {
    super(device);
  }

  /**
   *
   *
   * @param {*} packet
   * @memberof JoyConLeft
   */
  _receiveInputEvent(packet) {
    delete packet.buttonStatus.x;
    delete packet.buttonStatus.y;
    delete packet.buttonStatus.b;
    delete packet.buttonStatus.a;
    delete packet.buttonStatus.plus;
    delete packet.buttonStatus.r;
    delete packet.buttonStatus.zr;
    delete packet.buttonStatus.home;
    delete packet.buttonStatus.rightStick;

    this.dispatchEvent(new CustomEvent('hidinput', { detail: packet }));
  }
}

/**
 *
 *
 * @class JoyConRight
 * @extends {JoyCon}
 */
class JoyConRight extends JoyCon {
  /**
   * Creates an instance of JoyConRight.
   *
   * @param {HIDDevice} device
   * @memberof JoyConRight
   */
  constructor(device) {
    super(device);
  }

  /**
   * Deals with receiving input events.
   *
   * @param {*} packet
   * @memberof JoyConRight
   */
  _receiveInputEvent(packet) {
    delete packet.buttonStatus.up;
    delete packet.buttonStatus.down;
    delete packet.buttonStatus.left;
    delete packet.buttonStatus.right;
    delete packet.buttonStatus.minus;
    delete packet.buttonStatus.l;
    delete packet.buttonStatus.zl;
    delete packet.buttonStatus.capture;
    delete packet.buttonStatus.leftStick;

    this.dispatchEvent(new CustomEvent('hidinput', { detail: packet }));
  }
}

/**
 *
 *
 * @class GeneralController
 * @extends {JoyCon}
 */
class GeneralController extends JoyCon {
  /**
   * Creates an instance of GeneralController.
   *
   * @param {HIDDevice} device
   * @memberof GeneralController
   */
  constructor(device) {
    super(device);
  }

  /**
   *
   *
   * @param {*} packet
   * @memberof GeneralController
   */
  _receiveInputEvent(packet) {
    this.dispatchEvent(new CustomEvent('hidinput', { detail: packet }));
  }
}

export { GeneralController, JoyConLeft, JoyConRight };
