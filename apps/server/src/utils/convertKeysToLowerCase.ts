export function convertKeysToLowerCase(obj: { [key: string]: any }): {
  [key: string]: any;
} {
  return Object.keys(obj).reduce((acc: { [key: string]: any }, key: string) => {
    acc[key.toLowerCase()] = obj[key];
    return acc;
  }, {});
}
