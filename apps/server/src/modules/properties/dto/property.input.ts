import { PropertyType } from '@prisma/client';

export class PropertyInput {
  id?: number | null;
  number?: string | null;
  floor: number;
  entrance?: number | null;
  totalArea: number;
  livingArea?: number | null;
  rooms?: number | null;
  wallHeight?: number | null;
  propertyType: PropertyType;
  buildingId: number;
}
