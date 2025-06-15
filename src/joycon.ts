import * as PacketParser from "./parse.ts";
import { connectRingCon } from "./connectRingCon.ts";
import type { JoyConEvents, JoyConLastValues, PacketType } from "./types.ts";
import { concatTypedArrays } from "./utils.ts";

class JoyCon extends EventTarget {
	eventListenerAttached = false;
	device: HIDDevice;
	lastValues: JoyConLastValues;
	ledstate = 0;

	constructor(device: HIDDevice) {
		super();
		this.device = device;
		this.lastValues = {
			timestamp: undefined,
			alpha: 0,
			beta: 0,
			gamma: 0,
		};
	}

	/**
	 * Type-safe event listener for JoyCon custom events.
	 */
	on<K extends keyof JoyConEvents>(
		type: K,
		listener: (this: JoyCon, ev: JoyConEvents[K]) => void,
		options?: boolean | AddEventListenerOptions,
	): void {
		super.addEventListener(type, listener as EventListener, options);
	}

	async open(): Promise<void> {
		if (!this.device.opened) {
			await this.device.open();
		}
		this.device.addEventListener("inputreport", this._onInputReport.bind(this));
	}

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

	async enableRingCon(): Promise<void> {
		await connectRingCon(this.device);
	}

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

	async setLEDState(n: number): Promise<void> {
		const NO_RUMBLE = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
		const subcommand = [0x30, n];
		await this.device.sendReport(
			0x01,
			new Uint8Array([...NO_RUMBLE, 0, ...subcommand]),
		);
	}

	async setLED(n: number): Promise<void> {
		this.ledstate |= 1 << n;
		await this.setLEDState(this.ledstate);
	}

	async resetLED(n: number): Promise<void> {
		this.ledstate &= ~((1 << n) | (1 << (4 + n)));
		await this.setLEDState(this.ledstate);
	}

	async blinkLED(n: number): Promise<void> {
		this.ledstate &= ~(1 << n);
		this.ledstate |= 1 << (4 + n);
		await this.setLEDState(this.ledstate);
	}

	_onInputReport({ data, reportId, device }: HIDInputReportEvent): void {
		if (!data) {
			return;
		}

		// Convert DataView to Uint8Array
		const dataArray = new Uint8Array(data.buffer);
		const fullData = concatTypedArrays(new Uint8Array([reportId]), dataArray);
		const hexData = Array.from(fullData)
			.map((byte) => byte.toString(16).padStart(2, "0"))
			.join("");
		// @ts-ignore
		let packet: PacketType = {
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
					vibrator: PacketParser.parseVibrator?.(fullData, hexData),
				};
				if (reportId === 0x21) {
					packet = {
						...packet,
						ack: PacketParser.parseAck?.(fullData, hexData),
						subcommandID: PacketParser.parseSubcommandID?.(fullData, hexData),
						subcommandReplyData: PacketParser.parseSubcommandReplyData?.(
							fullData,
							hexData,
						),
						deviceInfo: PacketParser.parseDeviceInfo(fullData),
					};
				}
				if (reportId === 0x30) {
					const accelerometers = PacketParser.parseAccelerometers?.(
						fullData,
						hexData,
					);
					const gyroscopes = PacketParser.parseGyroscopes?.(fullData, hexData);
					const rps = PacketParser.calculateActualGyroscope?.(
						gyroscopes.map((g) => g.map((v) => v.rps ?? 0)),
					);
					const dps = PacketParser.calculateActualGyroscope?.(
						gyroscopes.map((g) => g.map((v) => v.dps ?? 0)),
					);
					const acc = PacketParser.calculateActualAccelerometer?.(
						accelerometers.map((a) => [
							a.x.acc ?? 0,
							a.y.acc ?? 0,
							a.z.acc ?? 0,
						]),
					);
					const quaternion = PacketParser.toQuaternion?.(
						rps,
						acc,
						device.productId,
					);
					packet = {
						...packet,
						accelerometers: accelerometers,
						gyroscopes: gyroscopes,
						actualAccelerometer: acc,
						actualGyroscope: { dps, rps },
						actualOrientation: PacketParser.toEulerAngles?.(
							this.lastValues,
							rps,
							acc,
							device.productId,
						),
						actualOrientationQuaternion:
							PacketParser.toEulerAnglesQuaternion?.(quaternion),
						quaternion: quaternion,
						ringCon: PacketParser.parseRingCon?.(fullData, hexData),
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

	_receiveDeviceInfo(deviceInfo: unknown): void {
		this.dispatchEvent(new CustomEvent("deviceinfo", { detail: deviceInfo }));
	}

	_receiveBatteryLevel(batteryLevel: unknown): void {
		this.dispatchEvent(
			new CustomEvent("batterylevel", { detail: batteryLevel }),
		);
	}

	// To be overridden by subclasses
	_receiveInputEvent(_packet: unknown): void {}
}

class JoyConLeft extends JoyCon {
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

class GeneralController extends JoyCon {
	_receiveInputEvent(packet: unknown): void {
		this.dispatchEvent(new CustomEvent("hidinput", { detail: packet }));
	}
}

export { GeneralController, JoyConLeft, JoyConRight };
