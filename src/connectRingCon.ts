import type { SendReportAsyncFunctionOptions } from "./types.ts";

// from https://github.com/mascii/demo-of-ring-con-with-web-hid
export const connectRingCon = async (device: HIDDevice): Promise<void> => {
	const defineSendReportAsyncFunction = ({
		subcommand,
		expectedReport,
		timeoutErrorMessage = "timeout.",
	}: SendReportAsyncFunctionOptions) => {
		return (device: HIDDevice) =>
			new Promise<void>((resolve, reject) => {
				const timeoutId = setTimeout(() => {
					device.removeEventListener("inputreport", checkInputReport);
					reject(new Error(timeoutErrorMessage));
				}, 5000);

				const checkInputReport = (event: Event) => {
					const inputEvent = event as HIDInputReportEvent;
					if (inputEvent.reportId !== 0x21) {
						return;
					}

					const data = new Uint8Array(inputEvent.data.buffer);
					for (const [key, value] of Object.entries(expectedReport)) {
						if (data[Number(key) - 1] !== value) {
							return;
						}
					}

					device.removeEventListener("inputreport", checkInputReport);
					clearTimeout(timeoutId);
					setTimeout(resolve, 50);
				};
				device.addEventListener("inputreport", checkInputReport);

				(async () => {
					await device.sendReport(
						0x01,
						new Uint8Array([
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
						]),
					);
					// resolve();
				})();
			});
	};

	// eslint-disable-next-line no-unused-vars
	const setInputReportModeTo0x30 = defineSendReportAsyncFunction({
		subcommand: [0x03, 0x30],
		expectedReport: {
			14: 0x03,
		},
	});
	const enablingMCUData221 = defineSendReportAsyncFunction({
		subcommand: [0x22, 0x01],
		expectedReport: {
			13: 0x80,
			14: 0x22,
		},
	});
	const enablingMCUData212111 = defineSendReportAsyncFunction({
		subcommand: [
			0x21, 0x21, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0xf3,
		],
		expectedReport: {
			14: 0x21,
		},
	});
	const getExtData59 = defineSendReportAsyncFunction({
		subcommand: [0x59],
		expectedReport: {
			14: 0x59,
			16: 0x20,
		},
		timeoutErrorMessage: "ring-con not found.",
	});
	const getExtDevInFormatConfig5C = defineSendReportAsyncFunction({
		subcommand: [
			0x5c, 0x06, 0x03, 0x25, 0x06, 0x00, 0x00, 0x00, 0x00, 0x1c, 0x16, 0xed,
			0x34, 0x36, 0x00, 0x00, 0x00, 0x0a, 0x64, 0x0b, 0xe6, 0xa9, 0x22, 0x00,
			0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x90, 0xa8, 0xe1,
			0x34, 0x36,
		],
		expectedReport: {
			14: 0x5c,
		},
	});
	const startExternalPolling5A = defineSendReportAsyncFunction({
		subcommand: [0x5a, 0x04, 0x01, 0x01, 0x02],
		expectedReport: {
			14: 0x5a,
		},
	});

	// await setInputReportModeTo0x30(device); // same as enableStandardFullMode
	await enablingMCUData221(device);
	await enablingMCUData212111(device);
	await getExtData59(device);
	await getExtDevInFormatConfig5C(device);
	await startExternalPolling5A(device);
};
