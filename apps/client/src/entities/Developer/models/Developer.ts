import { Group } from '../../Group/models/Group';

export interface Developer {
  id: number;
  name: string;
  fullName: string;
  legalAddress: string | null;
  actualAddress: string | null;
  inn: string | null;
  kpp: string | null;
  ogrn: string | null;
  email: string | null;
  phone: string | null;
  manager: string | null;
  website: string | null;
  info: string | null;
  groupId: number;
  group?: Group;
}

export interface DeveloperDto extends Omit<Developer, 'id' | 'group'> {
  id?: number;
}
