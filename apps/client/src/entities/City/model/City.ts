import { Region } from '../../Region/models/Region';

export interface City {
  id: number;
  name: string;
  regionId: number;
  region: Region;
}

export interface CityDto extends Omit<City, 'id' | 'createdAt' | 'updatedAt' | 'region'> {
  id?: number;
}
