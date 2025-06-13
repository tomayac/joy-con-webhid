export const concatTypedArrays = (a: Uint8Array, b: Uint8Array): Uint8Array => {
	const c = new Uint8Array(a.length + b.length);
	c.set(a, 0);
	c.set(b, a.length);
	return c;
};
