import { Complex } from '../../Complex/model/Complex';
import { Developer } from '../../Developer/models/Developer';
import { City } from '../../City/model/City';
import { Property, PropertyAnaliticsData } from '../../Property/models/Property';
import { Group } from '../../Group/models/Group';
import { Sale, SalesAnalitics } from '../../Sale/models/Sale';

export enum PropertyClasses {
  TYPICAL = 'Типовой',
  ECONOMY = 'Эконом',
  COMFORT = 'Комфорт',
  BUSINESS = 'Бизнес',
  PREMIUM = 'Премиум',
}

export type PropertyClass = keyof typeof PropertyClasses;

export enum DecorTypes {
  WITHOUT = 'Без отделки',
  UNDER_FINISHING = 'Под чистовую',
  FINISHING = 'Чистовая',
  FULL = 'Под ключ',
  OPTIONALLY = 'По выбору',
}

export type DecorType = keyof typeof DecorTypes;

export enum WallMaterials {
  MONOLITH_BRICK = 'Монолит-кирпич',
  BLOCKS = 'Блоки',
  BRICK = 'Кирпич',
  PANEL = 'Панель',
  MONOLITH = 'Монолит',
}

export type WallMaterial = keyof typeof WallMaterials;

export interface Building {
  id: number;
  name: string;
  address: string | null;
  completionDate: string | null;
  completed: boolean;
  propertyClass: PropertyClass | null;
  wallMaterial: WallMaterial | null;
  decorType: DecorType | null;
  latitude: number | null;
  longitude: number | null;
  img: string | null;
  domClickId: number | null;
  domRfId: number | null;
  cityId: number;
  city: City;
  districtId: number;
  groupId: number;
  group: Group;
  developerId: number;
  developer?: Developer;
  complexId: number;
  complex: Complex;
  sales?: Sale[];
}

export interface BuildingDto extends Omit<Building, 'id' | 'complex' | 'area' | 'city' | 'group'> {
  id?: number;
}

export interface BuildingsData {
  buildings: Building[];
  total: number;
}

export interface BuildingProperties extends Omit<Building, 'sales' | 'city'> {
  properties: Property[];
}

export interface BuildingAnalitics {
  building: Building;
  analitics: PropertyAnaliticsData;
  sales: SalesAnalitics;
}
