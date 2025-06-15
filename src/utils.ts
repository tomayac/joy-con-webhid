export function concatTypedArrays<T extends Uint8Array>(a: T, b: T): T {
	const c = new (Object.getPrototypeOf(a).constructor)(
		a.length + b.length,
	) as T;
	c.set(a, 0);
	c.set(b, a.length);
	return c;
}
