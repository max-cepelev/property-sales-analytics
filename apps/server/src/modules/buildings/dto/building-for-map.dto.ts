import { PropertyClass } from '@prisma/client';

export class BuildingsForMapDto {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  propertyClass: PropertyClass | null;
  complexName: string;
}
