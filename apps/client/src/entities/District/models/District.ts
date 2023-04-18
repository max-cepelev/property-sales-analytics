import { City } from '../../City/model/City';

export interface District {
  id: number;
  name: string;
  cityId: number;
  city?: City;
}

export interface DistrictDto extends Omit<District, 'id' | 'city'> {
  id?: number;
}
