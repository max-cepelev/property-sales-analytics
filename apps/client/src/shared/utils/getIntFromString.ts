const getIntFromString = (value: string | null) => {
  if (!value) return null;
  const num = parseInt(value, 10);
  if (isNaN(num)) return null;
  return num;
};

export default getIntFromString;
