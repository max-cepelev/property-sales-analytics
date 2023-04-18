import { SalesProps } from '../../Sale/models/Sale';

export interface Group {
  id: number;
  name: string;
  regions: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GroupSalesAnalitics {
  id: number;
  name: string;
  sales: SalesProps;
}

export interface GroupDto extends Omit<Group, 'id' | 'createdAt' | 'updatedAt'> {
  id?: number;
}
