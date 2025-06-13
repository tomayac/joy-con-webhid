import { connectRingCon } from "./connectRingCon.ts";
import * as PacketParser from "./parse.ts";

type JoyConLastValues = {
	timestamp: number | null;
	alpha: number;
	beta: number;
	gamma: number;
};

const concatTypedArrays = (a: Uint8Array, b: Uint8Array): Uint8Array => {
	const c = new Uint8Array(a.length + b.length);
	c.set(a, 0);
	c.set(b, a.length);
	return c;
};

class JoyCon extends EventTarget {
	device: HIDDevice;
	lastValues: JoyConLastValues;
	ledstate = 0;

	constructor(device: HIDDevice) {
		super();
		this.device = device;
		this.lastValues = {
			timestamp: null,
			alpha: 0,
			beta: 0,
			gamma: 0,
		};
	}

	async open(): Promise<void> {
		if (!this.device.opened) {
			await this.device.open();
		}
		this.device.addEventListener("inputreport", this._onInputReport.bind(this));
	}

	async getRequestDeviceInfo(): Promise<any> {
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
		const result = new Promise<any>((resolve) => {
			const onDeviceInfo = ({ detail: deviceInfo }: any) => {
				this.removeEventListener("deviceinfo", onDeviceInfo);

				const { _raw, _hex, ...cleanDeviceInfo } = deviceInfo;

				resolve(cleanDeviceInfo);
			};
			this.addEventListener("deviceinfo", onDeviceInfo);
		});
		await this.device.sendReport(outputReportID, new Uint8Array(data));
		return result;
	}

	async getBatteryLevel(): Promise<any> {
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
		const result = new Promise<any>((resolve) => {
			const onBatteryLevel = ({ detail: batteryLevel }: any) => {
				this.removeEventListener("batterylevel", onBatteryLevel);

				const { _raw, _hex, ...cleanBatteryLevel } = batteryLevel;

				resolve(cleanBatteryLevel);
			};
			this.addEventListener("batterylevel", onBatteryLevel);
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
		await connectRingCon(this.device as any);
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

	_onInputReport(event: any): void {
		let { data, reportId, device } = event;
		if (!data) {
			return;
		}
		data = concatTypedArrays(
			new Uint8Array([reportId]),
			new Uint8Array(data.buffer),
		);
		const hexData = Array.from(data as Uint8Array).map((byte: number) =>
			byte.toString(16),
		);
		let packet: any = {
			inputReportID: PacketParser.parseInputReportID(data, data),
		};
		switch (reportId) {
			case 0x3f: {
				packet = {
					...packet,
					buttonStatus: PacketParser.parseButtonStatus(data, data),
					analogStick: PacketParser.parseAnalogStick(data, data),
					filter: PacketParser.parseFilter(data, data),
				};
				break;
			}
			case 0x21:
			case 0x30: {
				packet = {
					...packet,
					timer: PacketParser.parseTimer(data, data),
					batteryLevel: PacketParser.parseBatteryLevel(data, data),
					connectionInfo: PacketParser.parseConnectionInfo(data, data),
					buttonStatus: PacketParser.parseCompleteButtonStatus(data, data),
					analogStickLeft: PacketParser.parseAnalogStickLeft(data, data),
					analogStickRight: PacketParser.parseAnalogStickRight(data, data),
				};
				if (reportId === 0x21) {
					packet = {
						...packet,
						deviceInfo: PacketParser.parseDeviceInfo(data, data),
					};
				}
				if (reportId === 0x30) {
					packet = {
						...packet,
						ringCon: PacketParser.parseRingCon(data, data),
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

	_receiveDeviceInfo(deviceInfo: any): void {
		this.dispatchEvent(new CustomEvent("deviceinfo", { detail: deviceInfo }));
	}

	_receiveBatteryLevel(batteryLevel: any): void {
		this.dispatchEvent(
			new CustomEvent("batterylevel", { detail: batteryLevel }),
		);
	}

	// To be overridden by subclasses
	_receiveInputEvent(packet: any): void {}
}

class JoyConLeft extends JoyCon {
	_receiveInputEvent(packet: any): void {
		delete packet.buttonStatus.x;
		delete packet.buttonStatus.y;
		delete packet.buttonStatus.b;
		delete packet.buttonStatus.a;
		delete packet.buttonStatus.plus;
		delete packet.buttonStatus.r;
		delete packet.buttonStatus.zr;
		delete packet.buttonStatus.home;
		delete packet.buttonStatus.rightStick;
		this.dispatchEvent(new CustomEvent("hidinput", { detail: packet }));
	}
}

class JoyConRight extends JoyCon {
	_receiveInputEvent(packet: any): void {
		delete packet.buttonStatus.up;
		delete packet.buttonStatus.down;
		delete packet.buttonStatus.left;
		delete packet.buttonStatus.right;
		delete packet.buttonStatus.minus;
		delete packet.buttonStatus.l;
		delete packet.buttonStatus.zl;
		delete packet.buttonStatus.capture;
		delete packet.buttonStatus.leftStick;
		this.dispatchEvent(new CustomEvent("hidinput", { detail: packet }));
	}
}

class GeneralController extends JoyCon {
	_receiveInputEvent(packet: any): void {
		this.dispatchEvent(new CustomEvent("hidinput", { detail: packet }));
	}
}

export { GeneralController, JoyConLeft, JoyConRight };
