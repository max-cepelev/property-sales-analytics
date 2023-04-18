const getDateFormat = (dt: string) => {
  const date = new Date(dt);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export default getDateFormat;
