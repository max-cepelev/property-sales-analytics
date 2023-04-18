/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Building = {
  __typename?: 'Building';
  address: Scalars['String'];
  city: City;
  cityId: Scalars['Int'];
  completed: Scalars['Boolean'];
  completionDate?: Maybe<Scalars['String']>;
  complex: Complex;
  complexId: Scalars['Int'];
  decorType?: Maybe<DecorType>;
  developer: Developer;
  developerId: Scalars['Int'];
  district: District;
  districtId: Scalars['Int'];
  domClickId?: Maybe<Scalars['Int']>;
  domRfId?: Maybe<Scalars['Int']>;
  group: Group;
  groupId: Scalars['Int'];
  id: Scalars['Int'];
  img?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  properties: Array<Property>;
  propertyClass?: Maybe<PropertyClass>;
  sales: Array<Sale>;
  wallMaterial?: Maybe<WallMaterial>;
};

export type BuildingForMap = {
  __typename?: 'BuildingForMap';
  complexName: Scalars['String'];
  id: Scalars['Int'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  name: Scalars['String'];
  propertyClass?: Maybe<PropertyClass>;
};

export type BuildingInput = {
  address: Scalars['String'];
  cityId: Scalars['Int'];
  completed?: Scalars['Boolean'];
  completionDate: Scalars['String'];
  complexId: Scalars['Int'];
  decorType?: InputMaybe<DecorType>;
  developerId: Scalars['Int'];
  districtId: Scalars['Int'];
  domClickId?: InputMaybe<Scalars['Int']>;
  domRfId?: InputMaybe<Scalars['Int']>;
  groupId: Scalars['Int'];
  id?: InputMaybe<Scalars['Int']>;
  img?: InputMaybe<Scalars['String']>;
  latitude?: InputMaybe<Scalars['Float']>;
  longitude?: InputMaybe<Scalars['Float']>;
  name: Scalars['String'];
  propertyClass?: InputMaybe<PropertyClass>;
  wallMaterial?: InputMaybe<WallMaterial>;
};

export type City = {
  __typename?: 'City';
  id: Scalars['Int'];
  name: Scalars['String'];
  region: Region;
  regionId: Scalars['Int'];
};

export type CityInput = {
  name: Scalars['String'];
  regionId: Scalars['Int'];
};

export type Complex = {
  __typename?: 'Complex';
  buildigs: Array<Building>;
  city: City;
  cityId: Scalars['Int'];
  district: District;
  districtId: Scalars['Int'];
  domClickId?: Maybe<Scalars['Int']>;
  domRfId?: Maybe<Scalars['Int']>;
  group: Group;
  groupId: Scalars['Int'];
  id: Scalars['Int'];
  info?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  shortName?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};

export type ComplexInput = {
  cityId: Scalars['Int'];
  districtId: Scalars['Int'];
  domClickId?: InputMaybe<Scalars['Int']>;
  domRfId?: InputMaybe<Scalars['Int']>;
  groupId: Scalars['Int'];
  id?: InputMaybe<Scalars['Int']>;
  info?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  shortName?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
};

export type DecorType = 'FINISHING' | 'FULL' | 'OPTIONALLY' | 'UNDER_FINISHING' | 'WITHOUT';

export type Developer = {
  __typename?: 'Developer';
  actualAddress?: Maybe<Scalars['String']>;
  buildigs: Array<Building>;
  email?: Maybe<Scalars['String']>;
  fullName: Scalars['String'];
  group: Group;
  groupId: Scalars['Int'];
  id: Scalars['Int'];
  info?: Maybe<Scalars['String']>;
  inn: Scalars['String'];
  kpp?: Maybe<Scalars['String']>;
  legalAddress?: Maybe<Scalars['String']>;
  manager?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  ogrn?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};

export type DeveloperInput = {
  actualAddress?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  fullName: Scalars['String'];
  groupId: Scalars['Int'];
  id?: InputMaybe<Scalars['Int']>;
  info?: InputMaybe<Scalars['String']>;
  inn: Scalars['String'];
  kpp?: InputMaybe<Scalars['String']>;
  legalAddress?: InputMaybe<Scalars['String']>;
  manager?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  ogrn?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
};

export type District = {
  __typename?: 'District';
  buildings: Array<Building>;
  city: City;
  cityId: Scalars['Int'];
  complexes: Array<Complex>;
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type DistrictInput = {
  cityId: Scalars['Int'];
  name: Scalars['String'];
};

export type Group = {
  __typename?: 'Group';
  id: Scalars['Int'];
  name: Scalars['String'];
  regions: Array<Region>;
};

export type Mutation = {
  __typename?: 'Mutation';
  activateUser: User;
  createBuilding: Building;
  createCity: City;
  createComplex: Complex;
  createDeveloper: Developer;
  createDistrict: District;
  createGroup: Group;
  createRegion: Region;
  deactivateUser: User;
  deleteBuilding?: Maybe<Building>;
  deleteCity?: Maybe<City>;
  deleteComplex?: Maybe<Complex>;
  deleteDeveloper?: Maybe<Developer>;
  deleteDistrict?: Maybe<District>;
  deleteGroup?: Maybe<Group>;
  deleteProperty?: Maybe<Property>;
  deleteRegion?: Maybe<Region>;
  deleteSale?: Maybe<Sale>;
  mutationTest: Scalars['String'];
  saveSales: Array<Sale>;
  updateBuilding?: Maybe<Building>;
  updateCity?: Maybe<City>;
  updateComplex?: Maybe<Complex>;
  updateDeveloper?: Maybe<Developer>;
  updateDistrict?: Maybe<District>;
  updateGroup?: Maybe<Group>;
  updateProperties?: Maybe<Array<Property>>;
  updateRegion?: Maybe<Region>;
};

export type MutationActivateUserArgs = {
  id: Scalars['Int'];
};

export type MutationCreateBuildingArgs = {
  input: BuildingInput;
};

export type MutationCreateCityArgs = {
  input: CityInput;
};

export type MutationCreateComplexArgs = {
  input: ComplexInput;
};

export type MutationCreateDeveloperArgs = {
  input: DeveloperInput;
};

export type MutationCreateDistrictArgs = {
  input: DistrictInput;
};

export type MutationCreateGroupArgs = {
  name: Scalars['String'];
};

export type MutationCreateRegionArgs = {
  input: RegionInput;
};

export type MutationDeactivateUserArgs = {
  id: Scalars['Int'];
};

export type MutationDeleteBuildingArgs = {
  id: Scalars['Int'];
};

export type MutationDeleteCityArgs = {
  id: Scalars['Int'];
};

export type MutationDeleteComplexArgs = {
  id: Scalars['Int'];
};

export type MutationDeleteDeveloperArgs = {
  id: Scalars['Int'];
};

export type MutationDeleteDistrictArgs = {
  id: Scalars['Int'];
};

export type MutationDeleteGroupArgs = {
  id: Scalars['Int'];
};

export type MutationDeletePropertyArgs = {
  id: Scalars['Int'];
};

export type MutationDeleteRegionArgs = {
  id: Scalars['Int'];
};

export type MutationDeleteSaleArgs = {
  id: Scalars['Int'];
};

export type MutationSaveSalesArgs = {
  input: Array<SaleInput>;
};

export type MutationUpdateBuildingArgs = {
  id: Scalars['Int'];
  input: BuildingInput;
};

export type MutationUpdateCityArgs = {
  id: Scalars['Int'];
  input: CityInput;
};

export type MutationUpdateComplexArgs = {
  id: Scalars['Int'];
  input: ComplexInput;
};

export type MutationUpdateDeveloperArgs = {
  id: Scalars['Int'];
  input: DeveloperInput;
};

export type MutationUpdateDistrictArgs = {
  id: Scalars['Int'];
  input: DistrictInput;
};

export type MutationUpdateGroupArgs = {
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type MutationUpdatePropertiesArgs = {
  input: Array<PropertyInput>;
};

export type MutationUpdateRegionArgs = {
  id: Scalars['Int'];
  input: RegionInput;
};

export type PropAggregate = {
  __typename?: 'PropAggregate';
  avgArea: Scalars['Float'];
  count: Scalars['Int'];
  entrances: Scalars['Int'];
  floors: Scalars['Int'];
  maxArea: Scalars['Float'];
  minArea: Scalars['Float'];
  totalArea: Scalars['Float'];
};

export type PropAggregateResponse = {
  __typename?: 'PropAggregateResponse';
  commercial: PropAggregate;
  living: PropAggregate;
  parking: PropAggregate;
};

export type PropCounts = {
  __typename?: 'PropCounts';
  commercial: Scalars['Int'];
  living: Scalars['Int'];
  parking: Scalars['Int'];
};

export type Property = {
  __typename?: 'Property';
  building: Building;
  buildingId: Scalars['Int'];
  entrance?: Maybe<Scalars['Int']>;
  floor: Scalars['Float'];
  id: Scalars['Int'];
  livingArea?: Maybe<Scalars['Float']>;
  number?: Maybe<Scalars['String']>;
  propertyType?: Maybe<PropertyType>;
  rooms?: Maybe<Scalars['Int']>;
  totalArea: Scalars['Float'];
  wallHeight?: Maybe<Scalars['Float']>;
};

export type PropertyClass = 'BUSINESS' | 'COMFORT' | 'ECONOMY' | 'PREMIUM' | 'TYPICAL';

export type PropertyInput = {
  buildingId: Scalars['Int'];
  entrance?: InputMaybe<Scalars['Int']>;
  floor: Scalars['Float'];
  id?: InputMaybe<Scalars['Int']>;
  livingArea?: InputMaybe<Scalars['Float']>;
  number?: InputMaybe<Scalars['String']>;
  propertyType: PropertyType;
  rooms?: InputMaybe<Scalars['Int']>;
  totalArea: Scalars['Float'];
  wallHeight?: InputMaybe<Scalars['Float']>;
};

export type PropertyRoomsAggregate = {
  __typename?: 'PropertyRoomsAggregate';
  avgArea: Scalars['Float'];
  count: Scalars['Int'];
  maxArea: Scalars['Float'];
  minArea: Scalars['Float'];
};

export type PropertyRoomsAggregateResponse = {
  __typename?: 'PropertyRoomsAggregateResponse';
  four: PropertyRoomsAggregate;
  one: PropertyRoomsAggregate;
  three: PropertyRoomsAggregate;
  two: PropertyRoomsAggregate;
};

export type PropertyType = 'COMMERCIAL' | 'LIVING' | 'PARKING';

export type Query = {
  __typename?: 'Query';
  building?: Maybe<Building>;
  buildings: Array<Building>;
  buildingsForMap: Array<BuildingForMap>;
  cities: Array<City>;
  city?: Maybe<City>;
  complex?: Maybe<Complex>;
  complexes: Array<Complex>;
  developer?: Maybe<Developer>;
  developers: Array<Developer>;
  district?: Maybe<District>;
  districts: Array<District>;
  group?: Maybe<Group>;
  groups: Array<Group>;
  propAggregate: PropAggregateResponse;
  propCounts: PropCounts;
  propRoomsAggregate: PropertyRoomsAggregateResponse;
  properties: Array<Property>;
  queryTest: Scalars['String'];
  regions: Array<Region>;
  sales: Array<Sale>;
  salesAnalytics: Array<SalesAnalyticsResponse>;
  salesData: SalesDataResponse;
  salesSumByPropertyType: SalesSumByPropertyType;
  user: User;
  users: Array<User>;
};

export type QueryBuildingArgs = {
  id: Scalars['Int'];
};

export type QueryBuildingsArgs = {
  cityId?: InputMaybe<Scalars['Int']>;
  completed?: InputMaybe<Scalars['Boolean']>;
  complexId?: InputMaybe<Scalars['Int']>;
  districtId?: InputMaybe<Scalars['Int']>;
  groupId?: InputMaybe<Scalars['Int']>;
};

export type QueryCitiesArgs = {
  regionId?: InputMaybe<Scalars['Int']>;
};

export type QueryCityArgs = {
  id: Scalars['Int'];
};

export type QueryComplexArgs = {
  id: Scalars['Int'];
};

export type QueryComplexesArgs = {
  cityId?: InputMaybe<Scalars['Int']>;
  districtId?: InputMaybe<Scalars['Int']>;
  groupId?: InputMaybe<Scalars['Int']>;
};

export type QueryDeveloperArgs = {
  id: Scalars['Int'];
};

export type QueryDevelopersArgs = {
  groupId?: InputMaybe<Scalars['Int']>;
};

export type QueryDistrictArgs = {
  id: Scalars['Int'];
};

export type QueryDistrictsArgs = {
  cityId?: InputMaybe<Scalars['Int']>;
};

export type QueryGroupArgs = {
  id: Scalars['Int'];
};

export type QueryPropAggregateArgs = {
  buildingIds: Array<Scalars['Int']>;
  districtId?: InputMaybe<Scalars['Int']>;
  propertyClass?: InputMaybe<PropertyClass>;
};

export type QueryPropCountsArgs = {
  buildingId: Scalars['Int'];
};

export type QueryPropRoomsAggregateArgs = {
  buildingId: Scalars['Int'];
};

export type QueryPropertiesArgs = {
  buildingId?: InputMaybe<Scalars['Int']>;
  propertyType?: InputMaybe<PropertyType>;
};

export type QuerySalesArgs = {
  buildingId?: InputMaybe<Scalars['Int']>;
  propertyType?: InputMaybe<PropertyType>;
};

export type QuerySalesAnalyticsArgs = {
  buildingIds?: InputMaybe<Array<Scalars['Int']>>;
  districtId?: InputMaybe<Scalars['Int']>;
  propertyClass?: InputMaybe<PropertyClass>;
  propertyType: PropertyType;
};

export type QuerySalesDataArgs = {
  districtId?: InputMaybe<Scalars['Int']>;
  favorites?: InputMaybe<Array<Scalars['Int']>>;
  month: Scalars['Int'];
  propertyClass?: InputMaybe<PropertyClass>;
  propertyType: PropertyType;
  year: Scalars['Int'];
};

export type QuerySalesSumByPropertyTypeArgs = {
  buildingIds: Array<Scalars['Int']>;
  districtId?: InputMaybe<Scalars['Int']>;
  propertyClass?: InputMaybe<PropertyClass>;
};

export type QueryUserArgs = {
  id: Scalars['Int'];
};

export type Region = {
  __typename?: 'Region';
  groups: Array<Group>;
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type RegionInput = {
  groups?: InputMaybe<Array<Scalars['Int']>>;
  name: Scalars['String'];
};

export type Role = 'ADMIN' | 'EDITOR' | 'USER';

export type Sale = {
  __typename?: 'Sale';
  amount: Scalars['Int'];
  area: Scalars['Float'];
  building: Building;
  buildingId: Scalars['Int'];
  id: Scalars['Int'];
  month: Scalars['Int'];
  propertyType?: Maybe<PropertyType>;
  sum: Scalars['Float'];
  year: Scalars['Int'];
};

export type SaleInput = {
  amount: Scalars['Int'];
  area: Scalars['Float'];
  buildingId: Scalars['Int'];
  id?: InputMaybe<Scalars['Int']>;
  month: Scalars['Int'];
  propertyType: PropertyType;
  sum: Scalars['Float'];
  year: Scalars['Int'];
};

export type SalesAnalyticsResponse = {
  __typename?: 'SalesAnalyticsResponse';
  amount?: Maybe<Scalars['Int']>;
  area?: Maybe<Scalars['Float']>;
  date: Scalars['String'];
  sum?: Maybe<Scalars['Float']>;
};

export type SalesData = {
  __typename?: 'SalesData';
  area: Scalars['Float'];
  number: Scalars['Int'];
  price: Scalars['Float'];
};

export type SalesDataByBuilding = {
  __typename?: 'SalesDataByBuilding';
  completionDate: Scalars['String'];
  complexName: Scalars['String'];
  groupName: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
  sales: SalesData;
};

export type SalesDataByComplex = {
  __typename?: 'SalesDataByComplex';
  buildings: Array<SalesDataByBuilding>;
  groupName: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
  sales: SalesData;
};

export type SalesDataByGroup = {
  __typename?: 'SalesDataByGroup';
  complexes: Array<SalesDataByComplex>;
  id: Scalars['Int'];
  name: Scalars['String'];
  sales: SalesData;
};

export type SalesDataResponse = {
  __typename?: 'SalesDataResponse';
  groups: Array<SalesDataByGroup>;
  month: Scalars['Int'];
  year: Scalars['Int'];
};

export type SalesSum = {
  __typename?: 'SalesSum';
  amount?: Maybe<Scalars['Int']>;
  area?: Maybe<Scalars['Float']>;
  sum?: Maybe<Scalars['Float']>;
};

export type SalesSumByPropertyType = {
  __typename?: 'SalesSumByPropertyType';
  commercial: SalesSum;
  living: SalesSum;
  parking: SalesSum;
};

export type User = {
  __typename?: 'User';
  activated: Scalars['Boolean'];
  email: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
  phone: Scalars['String'];
  role: Role;
};

export type WallMaterial = 'BLOCKS' | 'BRICK' | 'MONOLITH' | 'MONOLITH_BRICK' | 'PANEL';
