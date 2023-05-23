import { PropertyType } from '.prisma/client';

export class SaleInput {
  id?: number | null;
  month: number;
  year: number;
  amount: number;
  area: number;
  sum: number;
  propertyType: PropertyType;
  buildingId: number;
}
