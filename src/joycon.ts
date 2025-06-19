import { connectRingCon } from "./connectRingCon.ts";
import { Madgwick } from "./madgwick.ts";
import * as PacketParser from "./parse.ts";
import type {
	JoyConDataPacket,
	JoyConEvents,
	JoyConLastValues,
	Madgwick as MadgwickType,
	Quaternion,
} from "./types.ts";
import { concatTypedArrays } from "./utils.ts";

class JoyCon extends EventTarget {
	eventListenerAttached = false;
	quaternion!: Quaternion;
	madgwick!: MadgwickType;
	device: HIDDevice;
	lastValues: JoyConLastValues;
	ledstate = 0;

	/**
	 * Creates an instance of the JoyCon class.
	 *
	 * @param device - The HIDDevice instance representing the connected Joy-Con controller.
	 *
	 * Initializes the device and sets up the initial state for sensor values,
	 * including timestamp, alpha, beta, and gamma.
	 */
	constructor(device: HIDDevice) {
		super();
		this.device = device;
		this.lastValues = {
			timestamp: null,
			alpha: 0,
			beta: 0,
			gamma: 0,
		};

		if (device.productId === 0x2006) {
			this.madgwick = Madgwick(10);
			this.quaternion = this.madgwick.getQuaternion();
		} else if (device.productId === 0x2007) {
			this.madgwick = Madgwick(10);
			this.quaternion = this.madgwick.getQuaternion();
		}
	}

	/**
	 * Registers an event listener for a specific JoyCon event type.
	 *
	 * @typeParam K - The type of the JoyCon event to listen for, constrained to the keys of `JoyConEvents`.
	 * @param type - The event type to listen for.
	 * @param listener - The callback function that will be invoked when the event is dispatched.
	 *                   The `this` context within the listener is bound to the current `JoyCon` instance,
	 *                   and the event object is of the type corresponding to the event type.
	 * @param options - Optional. An options object specifying characteristics about the event listener,
	 *                  or a boolean indicating whether events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree.
	 */
	on<K extends keyof JoyConEvents>(
		type: K,
		listener: (this: JoyCon, ev: JoyConEvents[K]) => void,
		options?: boolean | AddEventListenerOptions,
	): void {
		super.addEventListener(type, listener as EventListener, options);
	}

	/**
	 * Opens a connection to the Joy-Con device if it is not already opened,
	 * and attaches an event listener for input reports.
	 *
	 * @returns {Promise<void>} A promise that resolves when the device is opened and the event listener is attached.
	 */
	async open(): Promise<void> {
		if (!this.device.opened) {
			await this.device.open();
		}

		this.device.addEventListener("inputreport", this._onInputReport.bind(this));
	}

	/**
	 * Sends a request to the Joy-Con device to retrieve device information.
	 *
	 * This method sends a specific output report to the device and listens for a
	 * "deviceinfo" event. When the event is received, it resolves with the device
	 * information, excluding any raw or hexadecimal data fields.
	 *
	 * @returns A promise that resolves with the cleaned device information object.
	 */
	async getRequestDeviceInfo(): Promise<unknown> {
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
		const result = new Promise((resolve) => {
			const onDeviceInfo = ({ detail: deviceInfo }: CustomEvent) => {
				const { _raw, _hex, ...cleanDeviceInfo } = deviceInfo as Record<
					string,
					unknown
				>;
				resolve(cleanDeviceInfo);
			};
			this.addEventListener("deviceinfo", onDeviceInfo as EventListener, {
				once: true,
			});
		});
		await this.device.sendReport(outputReportID, new Uint8Array(data));
		return result;
	}

	/**
	 * Requests the current battery level from the Joy-Con device.
	 *
	 * Sends a specific output report to the device to query the battery level,
	 * then listens for a "batterylevel" custom event. Once the event is received,
	 * it resolves with the battery level information, excluding any raw or hex data.
	 *
	 * @returns {Promise<unknown>} A promise that resolves with the cleaned battery level data.
	 */
	async getBatteryLevel(): Promise<unknown> {
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
		const result = new Promise((resolve) => {
			const onBatteryLevel = ({ detail: batteryLevel }: CustomEvent) => {
				const { _raw, _hex, ...cleanBatteryLevel } = batteryLevel as Record<
					string,
					unknown
				>;
				resolve(cleanBatteryLevel);
			};
			this.addEventListener("batterylevel", onBatteryLevel as EventListener, {
				once: true,
			});
		});
		await this.device.sendReport(outputReportID, new Uint8Array(data));
		return result;
	}

	/**
	 * Enables the Simple HID mode on the connected Joy-Con device.
	 *
	 * This method sends a specific output report to the device to switch it into
	 * Simple HID mode, which allows for basic input/output communication.
	 *
	 * @returns {Promise<void>} A promise that resolves once the command has been sent.
	 * @throws {DOMException} If the report cannot be sent to the device.
	 */
	async enableSimpleHIDMode(): Promise<void> {
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
	 * Enables the "Standard Full Mode" on the Joy-Con device by sending the appropriate subcommand.
	 *
	 * This mode allows the Joy-Con to report all standard input data, including button presses,
	 * analog stick positions, and sensor data. The method constructs the required data packet
	 * and sends it to the device using the HID report protocol.
	 *
	 * @returns {Promise<void>} A promise that resolves once the command has been sent.
	 * @throws {Error} If the device communication fails.
	 */
	async enableStandardFullMode(): Promise<void> {
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
	 * Enables the IMU (Inertial Measurement Unit) mode on the Joy-Con device.
	 *
	 * Sends a subcommand to the device to activate the IMU, which allows the Joy-Con
	 * to start reporting motion sensor data such as accelerometer and gyroscope readings.
	 *
	 * @returns A promise that resolves when the command has been sent to the device.
	 * @throws Will throw an error if sending the report to the device fails.
	 */
	async enableIMUMode(): Promise<void> {
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
	 * Disables the IMU (Inertial Measurement Unit) mode on the connected Joy-Con device.
	 *
	 * Sends a subcommand to the device to turn off IMU functionality, which includes
	 * the accelerometer and gyroscope sensors. This can be useful for reducing power
	 * consumption or when IMU data is not needed.
	 *
	 * @returns A promise that resolves when the command has been sent to the device.
	 * @throws Will throw an error if sending the report to the device fails.
	 */
	async disableIMUMode(): Promise<void> {
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
	 * Enables the vibration feature on the connected Joy-Con device.
	 *
	 * This method sends a specific output report to the device to activate vibration.
	 * It constructs the required data packet, including the subcommand for enabling vibration,
	 * and transmits it using the WebHID API.
	 *
	 * @returns A promise that resolves when the vibration command has been sent.
	 * @throws {DOMException} If sending the report to the device fails.
	 */
	async enableVibration(): Promise<void> {
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
	 * Disables the vibration feature on the connected Joy-Con controller.
	 *
	 * Sends a specific output report to the device to turn off vibration.
	 * This method constructs the appropriate data packet and sends it using the WebHID API.
	 *
	 * @returns A promise that resolves when the vibration disable command has been sent.
	 */
	async disableVibration(): Promise<void> {
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
	async enableRingCon(): Promise<void> {
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
	 * Enables the USB HID joystick report mode for the connected device.
	 *
	 * This method checks if the device supports a specific output report (with reportId 0x80).
	 * If supported, it sends a sequence of USB HID reports to the device to enable joystick reporting.
	 * The sequence of reports is required to properly initialize the device for joystick input over USB.
	 *
	 * @returns {Promise<void>} A promise that resolves once the reports have been sent.
	 */
	async enableUSBHIDJoystickReport(): Promise<void> {
		const usb =
			this.device.collections[0].outputReports?.find(
				(r) => r.reportId === 0x80,
			) != null;
		if (usb) {
			await this.device.sendReport(0x80, new Uint8Array([0x01]));
			await this.device.sendReport(0x80, new Uint8Array([0x02]));
			await this.device.sendReport(0x01, new Uint8Array([0x03]));
			await this.device.sendReport(0x80, new Uint8Array([0x04]));
		}
	}

	/**
	 * Sends a rumble (vibration) command to the Joy-Con device with the specified frequency and amplitude parameters.
	 *
	 * @param lowFrequency - The low frequency value for the rumble effect (in Hz). Must be between 40.875885 and 626.286133.
	 * @param highFrequency - The high frequency value for the rumble effect (in Hz). Must be between 81.75177 and 1252.572266.
	 * @param amplitude - The amplitude (strength) of the rumble effect. Must be between 0 (off) and 1 (maximum).
	 * @returns A promise that resolves when the rumble command has been sent to the device.
	 *
	 * @remarks
	 * This method encodes the frequency and amplitude values into the format expected by the Joy-Con hardware,
	 * clamps the input values to their valid ranges, and sends the resulting data packet via HID.
	 * The rumble effect is applied to both left and right motors of the Joy-Con.
	 */
	async rumble(
		lowFrequency: number,
		highFrequency: number,
		amplitude: number,
	): Promise<void> {
		const clamp = (value: number, min: number, max: number) => {
			return Math.min(Math.max(value, min), max);
		};
		const outputReportID = 0x10;
		const data = new Uint8Array(9);

		data[0] = 0x00;

		let lf = clamp(lowFrequency, 40.875885, 626.286133);
		let hf = clamp(highFrequency, 81.75177, 1252.572266);

		hf = (Math.round(32 * Math.log2(hf * 0.1)) - 0x60) * 4;
		lf = Math.round(32 * Math.log2(lf * 0.1)) - 0x40;

		const amp = clamp(amplitude, 0, 1);

		let hfAmp: number;
		if (amp === 0) {
			hfAmp = 0;
		} else if (amp < 0.117) {
			hfAmp = (Math.log2(amp * 1000) * 32 - 0x60) / (5 - amp ** 2) - 1;
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
	 * Sets the LED state on the Joy-Con device.
	 *
	 * Sends a subcommand to the device to control the LED indicators.
	 *
	 * @param n - The LED state value to set. The value determines which LEDs are turned on or off.
	 * @returns A promise that resolves when the command has been sent to the device.
	 */
	async setLEDState(n: number): Promise<void> {
		const NO_RUMBLE = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
		const subcommand = [0x30, n];
		await this.device.sendReport(
			0x01,
			new Uint8Array([...NO_RUMBLE, 0, ...subcommand]),
		);
	}

	/**
	 * Sets the specified LED on the Joy-Con controller.
	 *
	 * Updates the internal LED state by turning on the LED at the given index `n`,
	 * then sends the updated state to the device.
	 *
	 * @param n - The index of the LED to turn on (0-based).
	 * @returns A promise that resolves when the LED state has been updated.
	 */
	async setLED(n: number): Promise<void> {
		this.ledstate |= 1 << n;
		await this.setLEDState(this.ledstate);
	}

	/**
	 * Resets (turns off) the LED at the specified index by clearing its corresponding bits
	 * in the internal LED state and updates the device.
	 *
	 * @param n - The index of the LED to reset (0-based).
	 * @returns A promise that resolves when the LED state has been updated.
	 */
	async resetLED(n: number): Promise<void> {
		this.ledstate &= ~((1 << n) | (1 << (4 + n)));
		await this.setLEDState(this.ledstate);
	}

	/**
	 * Blinks the specified LED on the Joy-Con controller.
	 *
	 * This method updates the internal LED state by first turning off the LED at position `n`,
	 * then setting the corresponding blink bit for that LED. It then sends the updated state
	 * to the controller.
	 *
	 * @param n - The index of the LED to blink (typically 0-3).
	 * @returns A promise that resolves when the LED state has been updated.
	 */
	async blinkLED(n: number): Promise<void> {
		this.ledstate &= ~(1 << n);
		this.ledstate |= 1 << (4 + n);
		await this.setLEDState(this.ledstate);
	}

	/**
	 * Handles the HID input report event from a Joy-Con device, parses the incoming data,
	 * and emits structured input events based on the report type.
	 *
	 * @param event - The HID input report event containing the data, reportId, and device.
	 * @remarks
	 * This method processes different types of input reports (e.g., 0x3f, 0x21, 0x30) by parsing
	 * the raw data using various PacketParser methods. It extracts information such as button status,
	 * analog stick positions, battery level, accelerometer and gyroscope data, and device info.
	 * The parsed data is then dispatched to relevant handlers and listeners.
	 *
	 * @private
	 */
	_onInputReport({ data, reportId, device }: HIDInputReportEvent): void {
		if (!data) {
			return;
		}

		// Convert DataView to Uint8Array
		const fullData = concatTypedArrays(
			new Uint8Array([reportId]),
			new Uint8Array(data.buffer),
		);
		const hexData = Array.from(fullData)
			.map((byte) => byte.toString(16).padStart(2, "0"))
			.join("");

		let packet: Partial<JoyConDataPacket> = {
			inputReportID: PacketParser.parseInputReportID(fullData, hexData),
		};

		switch (reportId) {
			case 0x3f: {
				packet = {
					...packet,
					buttonStatus: PacketParser.parseButtonStatus(fullData, hexData),
					analogStick: PacketParser.parseAnalogStick(fullData, hexData),
					filter: PacketParser.parseFilter(fullData, hexData),
				};
				break;
			}
			case 0x21:
			case 0x30: {
				packet = {
					...packet,
					timer: PacketParser.parseTimer(fullData, hexData),
					batteryLevel: PacketParser.parseBatteryLevel(fullData, hexData),
					connectionInfo: PacketParser.parseConnectionInfo(fullData, hexData),
					buttonStatus: PacketParser.parseCompleteButtonStatus(
						fullData,
						hexData,
					),
					analogStickLeft: PacketParser.parseAnalogStickLeft(fullData, hexData),
					analogStickRight: PacketParser.parseAnalogStickRight(
						fullData,
						hexData,
					),
					vibrator: PacketParser.parseVibrator(fullData, hexData),
				};

				if (reportId === 0x21) {
					packet = {
						...packet,
						ack: PacketParser.parseAck(fullData, hexData),
						subcommandID: PacketParser.parseSubcommandID(fullData, hexData),
						subcommandReplyData: PacketParser.parseSubcommandReplyData(
							fullData,
							hexData,
						),
						deviceInfo: PacketParser.parseDeviceInfo(fullData),
					};
				}

				if (reportId === 0x30) {
					const accelerometers = PacketParser.parseAccelerometers(
						fullData,
						hexData,
					);
					const gyroscopes = PacketParser.parseGyroscopes(fullData, hexData);
					const rps = PacketParser.calculateActualGyroscope(
						gyroscopes.map((g) => g.map((v) => v.rps ?? 0)),
					);
					const dps = PacketParser.calculateActualGyroscope(
						gyroscopes.map((g) => g.map((v) => v.dps ?? 0)),
					);
					const acc = PacketParser.calculateActualAccelerometer(
						accelerometers.map((a) => [
							a.x.acc ?? 0,
							a.y.acc ?? 0,
							a.z.acc ?? 0,
						]),
					);

					this.madgwick.update(rps.x, rps.y, rps.z, acc.x, acc.y, acc.z);

					packet = {
						...packet,
						accelerometers: accelerometers,
						gyroscopes: gyroscopes,
						actualAccelerometer: acc,
						actualGyroscope: { dps, rps },
						actualOrientation: PacketParser.toEulerAngles(
							this.lastValues,
							rps,
							acc,
							device.productId,
						),
						actualOrientationQuaternion: PacketParser.toEulerAnglesQuaternion(
							this.quaternion,
						),
						quaternion: this.quaternion,
						ringCon: PacketParser.parseRingCon(fullData, hexData),
					};
				}
				break;
			}
		}

		if ((packet.deviceInfo as Record<string, unknown>)?.type) {
			this._receiveDeviceInfo(packet.deviceInfo);
		}

		if ((packet.batteryLevel as Record<string, unknown>)?.level) {
			this._receiveBatteryLevel(packet.batteryLevel);
		}

		this._receiveInputEvent(packet);
	}

	/**
	 * Dispatches a "deviceinfo" custom event with the provided device information as its detail.
	 *
	 * @param deviceInfo - The information about the device to be included in the event detail.
	 */
	_receiveDeviceInfo(deviceInfo: unknown): void {
		this.dispatchEvent(new CustomEvent("deviceinfo", { detail: deviceInfo }));
	}

	/**
	 * Dispatches a "batterylevel" custom event with the provided battery level detail.
	 *
	 * @param batteryLevel - The battery level information to include in the event detail.
	 */
	_receiveBatteryLevel(batteryLevel: unknown): void {
		this.dispatchEvent(
			new CustomEvent("batterylevel", { detail: batteryLevel }),
		);
	}

	// To be overridden by subclasses
	_receiveInputEvent(_packet: unknown): void {}
}

class JoyConLeft extends JoyCon {
	/**
	 * Handles an input event packet by removing specific button statuses and dispatching a custom "hidinput" event.
	 *
	 * @param packet - The input event data containing button statuses and other information.
	 *
	 * The method sets the following button statuses to `undefined` in the `buttonStatus` object:
	 * - x
	 * - y
	 * - b
	 * - a
	 * - plus
	 * - r
	 * - zr
	 * - home
	 * - rightStick
	 *
	 * After modifying the packet, it dispatches a `CustomEvent` named "hidinput" with the modified packet as its detail.
	 */
	_receiveInputEvent(packet: Record<string, unknown>): void {
		const buttonStatus = packet.buttonStatus as { [key: string]: unknown };
		buttonStatus.x = undefined;
		buttonStatus.y = undefined;
		buttonStatus.b = undefined;
		buttonStatus.a = undefined;
		buttonStatus.plus = undefined;
		buttonStatus.r = undefined;
		buttonStatus.zr = undefined;
		buttonStatus.home = undefined;
		buttonStatus.rightStick = undefined;
		this.dispatchEvent(new CustomEvent("hidinput", { detail: packet }));
	}
}

class JoyConRight extends JoyCon {
	/**
	 * Handles an input event packet from the Joy-Con device, sanitizes specific button statuses by setting them to `undefined`,
	 * and dispatches a "hidinput" custom event with the modified packet as its detail.
	 *
	 * @param packet - The input event data received from the Joy-Con, expected to contain a `buttonStatus` property.
	 */
	_receiveInputEvent(packet: Record<string, unknown>): void {
		const buttonStatus = packet.buttonStatus as { [key: string]: unknown };
		buttonStatus.up = undefined;
		buttonStatus.down = undefined;
		buttonStatus.left = undefined;
		buttonStatus.right = undefined;
		buttonStatus.minus = undefined;
		buttonStatus.l = undefined;
		buttonStatus.zl = undefined;
		buttonStatus.capture = undefined;
		buttonStatus.leftStick = undefined;
		this.dispatchEvent(new CustomEvent("hidinput", { detail: packet }));
	}
}

/**
 * Represents a general controller that extends the {@link JoyCon} class.
 *
 * This class is responsible for handling input events from a HID device and dispatching
 * them as custom "hidinput" events.
 *
 * @remarks
 * The {@link GeneralController} class provides a method to receive input packets from
 * the underlying HID device and dispatches them as custom events for further processing.
 *
 * @extends JoyCon
 */
class GeneralController extends JoyCon {
	/**
	 * Dispatches a "hidinput" custom event with the provided packet as its detail.
	 *
	 * @param packet - The input data received from the HID device.
	 */
	_receiveInputEvent(packet: unknown): void {
		this.dispatchEvent(new CustomEvent("hidinput", { detail: packet }));
	}
}

export { GeneralController, JoyConLeft, JoyConRight };
