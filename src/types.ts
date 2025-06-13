export type PacketParserType = {
	_raw: Uint8Array<ArrayBuffer>;
	_hex: Uint8Array<ArrayBuffer>;
	level?: string;
	type?: string;
};
