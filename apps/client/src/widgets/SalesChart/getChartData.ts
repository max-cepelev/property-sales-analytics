import { SalesChartData } from '.';
import { Sale, SalesAnalyticsResponse } from '~/shared/models/gql/graphql';

export const getChartData = (sales: (Sale | SalesAnalyticsResponse)[]): SalesChartData[] => {
  const data = sales.reduce((all: SalesChartData[], item) => {
    const num = item.amount || 0;
    const price = item.sum && item.area && item.area > 0 ? Math.round(item.sum / item.area) : null;
    const sold = num > 0 ? num : 0;
    const soldArea = item.area && item.area > 0 ? Math.round(item.area) : null;
    const date =
      item.__typename === 'Sale'
        ? new Date(item.year, item.month)
        : item.__typename === 'SalesAnalyticsResponse'
        ? new Date(item.date)
        : new Date();
    all.push({
      date,
      dateView: date.toLocaleString('ru-RU', {
        month: 'short',
        year: '2-digit',
      }),
      price: price === 0 ? null : price,
      priceView: price ? (price / 1000).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) : '',
      sold,
      soldArea,
    });
    return all;
  }, []);
  return data;
};
