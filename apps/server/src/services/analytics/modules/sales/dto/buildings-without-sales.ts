import { PropertyType } from '@prisma/client';

export class BuildingWithoutSales {
  id: number;
  name: string;
  completionDate: Date;
  domRfId: number | null;
  domClickId: number | null;
  tags: PropertyType[];
}
