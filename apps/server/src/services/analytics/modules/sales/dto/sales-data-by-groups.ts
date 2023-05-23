export class SalesData {
  number: number;
  area: number;
  price: number;
}

export class SalesDataByBuilding {
  id: number;
  name: string;
  complexName: string;
  groupName: string;
  sales: SalesData;
  completionDate: string;
}

export class SalesDataByComplex {
  id: number;
  name: string;
  groupName: string;
  buildings: SalesDataByBuilding[];
  sales: SalesData;
}

export class SalesDataByGroup {
  id: number;
  name: string;
  complexes: SalesDataByComplex[];
  sales: SalesData;
}

export class SalesDataResponse {
  year: number;
  month: number;
  groups: SalesDataByGroup[];
}
