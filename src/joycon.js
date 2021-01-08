import * as PacketParser from './parse.js';

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
   *Creates an instance of JoyCon.

   * @param {HIDDevice} device
   * @memberof JoyCon
   */
  constructor(device) {
    super();
    this.device = device;
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
    await this.device.sendReport(outputReportID, new Uint8Array(data));

    return new Promise((resolve) => {
      const onDeviceInfo = ({ detail: deviceInfo }) => {
        this.removeEventListener('deviceinfo', onDeviceInfo);
        delete deviceInfo._raw;
        delete deviceInfo._hex;
        resolve(deviceInfo);
      };
      this.addEventListener('deviceinfo', onDeviceInfo);
    });
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
    await this.device.sendReport(outputReportID, new Uint8Array(data));

    return new Promise((resolve) => {
      const onBatteryLevel = ({ detail: batteryLevel }) => {
        this.removeEventListener('batterylevel', onBatteryLevel);
        delete batteryLevel._raw;
        delete batteryLevel._hex;
        resolve(batteryLevel);
      };
      this.addEventListener('batterylevel', onBatteryLevel);
    });
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
              rps,
              acc,
              device.productId
            ),
            actualOrientationQuaternion: PacketParser.toEulerAnglesQuaternion(
              quaternion
            ),
            quaternion: quaternion,
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
   *Creates an instance of JoyConRight.
   * @param {HIDDevice} device
   * @memberof JoyConRight
   */
  constructor(device) {
    super(device);
  }

  /**
   *
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

export { JoyConLeft, JoyConRight };
