const compare = (a: unknown, b: unknown) => {
  if (typeof a === 'number' && typeof b === 'number') {
    if (a === b) return 0;
    if (a > b) return 1;
    if (a < b) return -1;
  }
  return 0;
};

export const sortBy = <T>(fields: (keyof T)[], arr: T[]) => {
  return arr.sort((a, b) => {
    for (const field of fields) {
      const result = compare(a[field], b[field]);

      if (result === 0) continue;

      return result;
    }

    return 0;
  });
};
