/**
 * Concatenates two typed arrays of the same type into a new typed array.
 *
 * @template T - The type of typed array extending Uint8Array
 * @param a - The first typed array to concatenate
 * @param b - The second typed array to concatenate
 * @returns A new typed array of the same type containing elements from both input arrays
 *
 * @example
 * ```typescript
 * const arr1 = new Uint8Array([1, 2, 3]);
 * const arr2 = new Uint8Array([4, 5, 6]);
 * const result = concatTypedArrays(arr1, arr2);
 * // result: Uint8Array([1, 2, 3, 4, 5, 6])
 * ```
 */
export function concatTypedArrays<T extends Uint8Array>(a: T, b: T): T {
  const c = new (Object.getPrototypeOf(a).constructor)(
    a.length + b.length
  ) as T;
  c.set(a, 0);
  c.set(b, a.length);
  return c;
}
