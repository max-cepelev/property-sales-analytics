export const getQuarter = (date?: string | null) => {
  if (date) {
    const dt = new Date(date);
    const month = dt.getMonth();
    const year = dt.getFullYear();
    if (month < 3) {
      return `I кв. ${year} г.`;
    }
    if (month > 3 && month < 6) {
      return `II кв. ${year} г.`;
    }
    if (month > 6 && month < 9) {
      return `III кв. ${year} г.`;
    }
    if (month > 9) {
      return `IV кв. ${year} г.`;
    }
  }
  return 'Нет данных';
};
