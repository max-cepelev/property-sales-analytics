import { Building } from '~/shared/models/gql/graphql';
import { PropertyType } from '../../Property/models/Property';

export interface Sale {
  id: number;
  month: number;
  year: number;
  amount: number;
  area: number;
  sum: number;
  propertyType: PropertyType;
  buildingId: number;
}

export interface SaleDto extends Omit<Sale, 'id'> {
  id?: number;
}

export interface SalesData extends Omit<Building, 'sales'> {
  sales: Sale[];
}

export interface SalesProps {
  amount: number | null;
  area: number | null;
  sum: number | null;
}

export interface SalesAnalitics {
  living: SalesProps;
  commercial: SalesProps;
  parking: SalesProps;
}

export const salesProps: (keyof SalesProps)[] = ['amount', 'area', 'sum'];

export interface SalesAnaliticsData extends SalesAnalitics {
  date: string;
}

export interface SaleRow {
  id: number | null;
  date: Date | null;
  amount: string | null;
  area: string | null;
  sum: string | null;
  edited: boolean;
  propertyType: PropertyType;
  buildingId: number;
}

export type SalesAggregate = {
  area: number;
  number: number;
  price: number;
};
