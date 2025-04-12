/**
 * Excludes specified keys from an object and returns a new object without those keys.
 *
 * @template Type - The type of the object.
 * @template Key - The keys of the object to be excluded.
 * @param obj - The object from which keys will be excluded.
 * @param keys - An array of keys to be removed from the object.
 * @returns A new object with the specified keys excluded.
 */
const exclude = <Type, Key extends keyof Type>(obj: Type, keys: Key[]): Omit<Type, Key> => {
  for (const key of keys) {
    delete obj[key];
  }
  return obj;
};

export default exclude;
