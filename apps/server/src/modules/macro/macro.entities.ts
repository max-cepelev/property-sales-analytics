export interface IMacroData {
  id: number;
  category_name: string;
  plan_image: string;
  status: number;
  status_real_name: string;
  estate_area: number;
  estate_price: number;
  estate_price_m2: number;
  estate_floor: number;
  estate_rooms: number | null;
  geo_flatnum: string | null;
  estate_price_action: number | null;
  geo_house_entrance: number | null;
  plan_name: string | null;
}

export interface IFamalyMacroData {
  records: IMacroData[];
}

export interface MinipolisData
  extends Omit<IMacroData, 'estate_area' | 'estate_price' | 'estate_price_m2'> {
  estate_area: string;
  estate_price: string;
  estate_price_m2: string;
}
