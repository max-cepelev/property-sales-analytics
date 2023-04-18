export const intToString = (number?: number | null) => {
  if (number && typeof number === 'number') {
    return number.toString();
  } else {
    return null;
  }
};

export const floatToString = (number?: number | null) => {
  if (number && typeof number === 'number') {
    return number.toLocaleString();
  } else {
    return null;
  }
};

export const stringToInt = (string: string | null) => {
  const value = string ? parseInt(string.replace(/\s+/g, '')) : null;
  if (value && !isNaN(value)) {
    return value;
  } else {
    return 0;
  }
};

export const stringToFloat = (string: string | null) => {
  const value = string ? parseFloat(string.replace(/\s+/g, '').replace(/\,/g, '.')) : null;
  if (value && !isNaN(value)) {
    return value;
  } else {
    return 0;
  }
};

export const isUniqueName = (
  first: string | null | undefined,
  second: string | null | undefined,
) => {
  if (first && second) {
    const one = first.replace(/\s+/g, '').toLowerCase();
    const two = second.replace(/\s+/g, '').toLowerCase();
    if (one !== two) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
};

export const isUniqueDate = (firstDate: Date | null, secondDate: Date | null) => {
  let response = true;
  if (firstDate && secondDate) {
    if (
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getFullYear() === secondDate.getFullYear()
    ) {
      response = false;
    } else {
      response = true;
    }
  }
  return response;
};
