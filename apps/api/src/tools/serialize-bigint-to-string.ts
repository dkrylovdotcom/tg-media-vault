/**
 * Recursively converts all bigint values within an object or array to strings.
 * 
 * @param obj - The input value which can be an object, array, or primitive.
 * @returns A new object/array/value with all bigints converted to string.
 *
 * Useful for safely serializing data containing bigints.
 */
export const serializeBigintToString = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(serializeBigintToString);
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k,
        typeof v === 'bigint' ? v.toString() : serializeBigintToString(v),
      ]),
    );
  }
  return obj;
}
