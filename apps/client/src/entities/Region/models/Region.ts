export interface Region {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegionDto extends Omit<Region, 'id' | 'createdAt' | 'updatedAt'> {
  id?: number;
}
