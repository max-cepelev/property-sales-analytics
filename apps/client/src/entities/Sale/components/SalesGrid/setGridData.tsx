import { PropertyType, Sale, SaleInput } from '~/shared/models/gql/graphql';
import { stringToFloat, stringToInt } from '~/shared/utils/helpers';
import { SaleRow } from '../../models/Sale';

export const dataToRows = (data: Sale[], propertyType: PropertyType) => {
  let number = 0,
    area = 0,
    price = 0;
  const rows = data.reduce((total: SaleRow[], item) => {
    if (item.propertyType === propertyType) {
      number = number + item.amount;
      area = area + item.area;
      price = price + item.sum;
      total.push({
        id: item.id,
        date: new Date(item.year, item.month),
        amount: number.toFixed(0),
        area: area.toLocaleString('ru-RU', { maximumFractionDigits: 2 }),
        sum: price.toLocaleString('ru-RU', { maximumFractionDigits: 2 }),
        propertyType: item.propertyType,
        buildingId: item.buildingId,
        edited: false,
      });
    }
    return total;
  }, []);
  return rows;
};

export const rowsToData = (rows: SaleRow[], buildingId: number, propertyType: PropertyType) => {
  let number = 0,
    area = 0,
    price = 0;

  const newData = rows.reduce((total: SaleInput[], item) => {
    const currentNumber = stringToInt(item.amount);
    const currentArea = stringToFloat(item.area);
    const currentPrice = stringToFloat(item.sum);
    const date = item.date ? new Date(item.date) : new Date();
    if (item.edited && item.date) {
      total.push({
        id: item.id ? item.id : undefined,
        year: date.getFullYear(),
        month: date.getMonth(),
        amount: item.amount ? currentNumber - number : 0,
        area: item.area ? currentArea - area : 0,
        sum: item.sum ? currentPrice - price : 0,
        propertyType,
        buildingId,
      });
    }
    number = item.amount ? currentNumber : number;
    area = item.area ? currentArea : area;
    price = item.sum ? currentPrice : price;
    return total;
  }, []);

  return newData;
};
