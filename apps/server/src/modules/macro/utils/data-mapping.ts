import { IMacroData, MinipolisData } from '../macro.entities';
import { MacroResponse } from '../macro.schema';

const getStatusName = (status: number) => {
  if (status === 20) {
    return 'Свободна';
  }
  if (status === 30) {
    return 'Бронь';
  }
  return '';
};

export const transformMacroData = (data: IMacroData[]): MacroResponse => {
  const response = [];
  for (const item of data) {
    if (item.status === 20 || item.status === 30) {
      response.push({
        id: item.id,
        category: item.category_name,
        image: item.plan_image,
        status: getStatusName(item.status),
        square: Number(item.estate_area),
        price: Number(item.estate_price),
        stockPrice: item.estate_price_action
          ? Number(item.estate_price_action)
          : null,
        decorPrice: null,
        mPrice: Number(item.estate_price_m2),
        floor: item.estate_floor,
        rooms: item.estate_rooms,
        flat: item.geo_flatnum,
        entrance: item.geo_house_entrance,
        plan: item.plan_name,
      });
    }
  }
  return response;
};

export const transformMinipolis = (data: MinipolisData[]): MacroResponse => {
  const getDecorPrice = (mPrice: number, square: number, plan_name: string) => {
    if (plan_name.includes('К2')) {
      return (mPrice + 12000) * square;
    }
    if (plan_name.includes('К3')) {
      return (mPrice + 10000) * square;
    }
    return (mPrice + 14000) * square;
  };
  const response = [];
  for (const item of data) {
    if (item.plan_name && (item.status === 20 || item.status === 30)) {
      const square = parseFloat(item.estate_area);
      const price = parseFloat(item.estate_price);
      const mPrice = parseFloat(item.estate_price_m2);
      response.push({
        id: item.id,
        category: item.category_name,
        image: item.plan_image,
        status: getStatusName(item.status),
        square,
        price,
        stockPrice: item.estate_price_action,
        mPrice,
        decorPrice: getDecorPrice(mPrice, square, item.plan_name),
        floor: item.estate_floor,
        rooms: item.estate_rooms,
        flat: item.geo_flatnum,
        entrance: item.geo_house_entrance,
        plan: item.plan_name,
      });
    }
  }
  return response;
};
