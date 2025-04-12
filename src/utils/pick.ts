/**
 * Picks specific properties from an object and returns a new object containing only those properties.
 *
 * @param obj - The source object from which properties will be picked.
 * @param keys - An array of strings representing the keys of the properties to pick from the object.
 * @returns A new object containing only the specified properties from the source object.
 *
 * @example
 * ```typescript
 * const source = { a: 1, b: 2, c: 3 };
 * const result = pick(source, ['a', 'c']);
 * console.log(result); // { a: 1, c: 3 }
 * ```
 */
const pick = (obj: object, keys: string[]) => {
  return keys.reduce<{ [key: string]: unknown }>((finalObj, key) => {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key as keyof typeof obj];
    }
    return finalObj;
  }, {});
};

export default pick;
