export enum PropertyTypes {
  LIVING = 'Жилая',
  COMMERCIAL = 'Коммерческая',
  PARKING = 'Машиноместа',
}

export type PropertyType = keyof typeof PropertyTypes;

export interface PropertyAnaliticsValues {
  _avg: { totalArea: number | null };
  _count: { id: number };
  _max: { totalArea: number | null };
  _min: { totalArea: number | null };
  _sum: { totalArea: number | null };
}

interface LivingAnaliticsValues extends Omit<PropertyAnaliticsValues, '_min' | '_max'> {
  _max: {
    entrance: number | null;
    floor: number | null;
    totalArea: number | null;
    wallHeight: number | null;
  };
  _min: { totalArea: number | null; wallHeight: number | null };
}

export interface PropertyAnaliticsData {
  commercial: PropertyAnaliticsValues;
  parking: PropertyAnaliticsValues;
  living: LivingAnaliticsValues;
  fourRoom: PropertyAnaliticsValues;
  oneRoom: PropertyAnaliticsValues;
  threeRoom: PropertyAnaliticsValues;
  twoRoom: PropertyAnaliticsValues;
}

export interface Property {
  id: number;
  number: string;
  floor: number;
  entrance: number | null;
  totalArea: number;
  livingArea: number | null;
  rooms: number | null;
  wallHeight: number | null;
  buildingId: number;
  propertyType: PropertyType;
}

export interface PropertyDto extends Omit<Property, 'id'> {
  id?: number;
}

export interface PropertyRow {
  id: number;
  number: string | null;
  floor: string | null;
  entrance: string | null;
  totalArea: string | null;
  livingArea: string | null;
  rooms: string | null;
  wallHeight: string | null;
  buildingId: number;
  edited: boolean;
}
