export function includeFields<T, Key extends keyof T>(object: T, keys: Key[]): Pick<T, Key> {
  const newObj: any = {};
  for (const key of keys) {
    newObj[key] = object[key];
  }
  return newObj as Pick<T, Key>;
}
