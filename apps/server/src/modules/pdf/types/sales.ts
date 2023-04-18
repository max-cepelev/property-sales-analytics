type Sale = {
  amount: number | null;
  area: number | null;
  sum: number | null;
};
export type SalesData = {
  date: string | null;
  day: number | null;
  month: number | null;
  year: number | null;
  living: Sale;
  commercial: Sale;
  parking: Sale;
};
