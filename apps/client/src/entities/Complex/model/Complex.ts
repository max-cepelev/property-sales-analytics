import { District } from '~/shared/models/gql/graphql';
import { City } from '../../City/model/City';
import { Group } from '../../Group/models/Group';

export interface Complex {
  id: number;
  name: string;
  shortName: string | null;
  website: string | null;
  info: string | null;
  domRfId: number | null;
  domClickId: number | null;
  groupId: number;
  cityId: number;
  city: City;
  districtId: number;
  district: District;
  group?: Group | null;
}

export interface ComplexDto extends Omit<Complex, 'id' | 'group' | 'city' | 'district'> {
  id?: number;
}
