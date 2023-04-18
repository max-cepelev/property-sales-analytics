export function excludeFields<T, Key extends keyof T>(object: T, keys: Key[]): Omit<T, Key> {
  for (const key of keys) {
    if (object[key] !== undefined) {
      delete object[key];
    }
  }
  return object;
}
