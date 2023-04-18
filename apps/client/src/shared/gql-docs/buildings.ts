import { gql, TypedDocumentNode } from '@apollo/client';
import { BuildingInputSchema } from '~/entities/Building/schema/buildingInputSchema';
import { PickFrom } from '~/shared/models/Common';
import {
  Building,
  BuildingForMap,
  SalesSumByPropertyType,
  PropAggregateResponse,
  PropertyRoomsAggregateResponse,
} from '~/shared/models/gql/graphql';

export const BUILDINGS: TypedDocumentNode<
  {
    buildings: PickFrom<
      Building,
      [
        'id',
        'name',
        'address',
        'completionDate',
        'propertyClass',
        'wallMaterial',
        'latitude',
        'longitude',
        'decorType',
        'complex',
        'group',
        'developer',
      ]
    >[];
  },
  {
    complexId?: number;
    groupId?: number;
    districtId?: number;
    cityId?: number;
    completed?: boolean;
  }
> = gql`
  query getBuildings(
    $cityId: Int
    $districtId: Int
    $groupId: Int
    $complexId: Int
    $completed: Boolean
  ) {
    buildings(
      cityId: $cityId
      districtId: $districtId
      groupId: $groupId
      complexId: $complexId
      completed: $completed
    ) {
      id
      name
      address
      completionDate
      propertyClass
      wallMaterial
      decorType
      latitude
      longitude
      complex {
        name
      }
      developer {
        name
      }
      group {
        name
      }
    }
  }
`;

export const BUILDING_WITH_DATA: TypedDocumentNode<
  {
    building: Building | null;
    buildingsForMap: BuildingForMap[];
    salesSumByPropertyType: SalesSumByPropertyType;
    propAggregate: PropAggregateResponse;
    propRoomsAggregate: PropertyRoomsAggregateResponse;
  },
  { buildingId: number }
> = gql`
  query getBuildingData($buildingId: Int!) {
    building(id: $buildingId) {
      id
      name
      latitude
      longitude
      address
      completionDate
      completed
      propertyClass
      wallMaterial
      decorType
      img
      domRfId
      domClickId
      cityId
      districtId
      groupId
      complexId
      developerId
      complex {
        name
      }
      city {
        name
        region {
          name
        }
      }
      group {
        name
      }
      developer {
        name
      }
      sales {
        month
        year
        sum
        area
        amount
        propertyType
      }
    }
    buildingsForMap {
      id
      name
      latitude
      longitude
      propertyClass
      complexName
    }
    salesSumByPropertyType(buildingIds: [$buildingId]) {
      living {
        area
        amount
        sum
      }
      commercial {
        area
        amount
        sum
      }
      parking {
        area
        amount
        sum
      }
    }
    propAggregate(buildingIds: [$buildingId]) {
      living {
        avgArea
        count
        entrances
        floors
        maxArea
        minArea
        totalArea
      }
      commercial {
        avgArea
        count
        entrances
        floors
        maxArea
        minArea
        totalArea
      }
      parking {
        avgArea
        count
        entrances
        floors
        maxArea
        minArea
        totalArea
      }
    }
    propRoomsAggregate(buildingId: $buildingId) {
      one {
        count
        avgArea
        minArea
        maxArea
      }
      two {
        count
        avgArea
        minArea
        maxArea
      }
      three {
        count
        avgArea
        minArea
        maxArea
      }
      four {
        count
        avgArea
        minArea
        maxArea
      }
    }
  }
`;

export const BUILDING_WITH_PROPERTIES: TypedDocumentNode<
  {
    building: Pick<Building, 'id' | 'name' | 'address' | 'complex' | 'properties'> | null;
  },
  { id: number }
> = gql`
  query getBuildingWithProps($id: Int!) {
    building(id: $id) {
      id
      name
      address
      complex {
        name
      }
      properties {
        id
        number
        floor
        entrance
        totalArea
        rooms
        wallHeight
        propertyType
        livingArea
        buildingId
      }
    }
  }
`;

export const BUILDING_PANEL_INFO: TypedDocumentNode<
  {
    building: Pick<Building, 'decorType' | 'propertyClass' | 'wallMaterial' | 'completionDate'>;
  },
  { id: number }
> = gql`
  query getBuilding($id: Int!) {
    building(id: $id) {
      id
      decorType
      propertyClass
      wallMaterial
      completionDate
    }
  }
`;

export const BUILDING_WITH_SALES: TypedDocumentNode<
  {
    building: Pick<
      Building,
      'id' | 'name' | 'address' | 'complex' | 'sales' | 'group' | 'domRfId'
    > | null;
  },
  { id: number }
> = gql`
  query getBuildingWithSales($id: Int!) {
    building(id: $id) {
      id
      name
      address
      domRfId
      complex {
        name
      }
      group {
        name
      }
      sales {
        id
        month
        year
        amount
        area
        sum
        propertyType
      }
    }
  }
`;

export const BUILDINGS_FOR_SELECTOR: TypedDocumentNode<
  {
    buildings: Pick<
      Building,
      'id' | 'name' | 'address' | 'complex' | 'group' | 'domClickId' | 'completionDate'
    >[];
  },
  { groupId?: number; districtId?: number; cityId?: number }
> = gql`
  query getBuildingsForSelector($cityId: Int, $districtId: Int, $groupId: Int) {
    buildings(groupId: $groupId, districtId: $districtId, cityId: $cityId) {
      id
      name
      address
      domClickId
      completionDate
      complex {
        name
      }
      group {
        name
      }
    }
  }
`;

export const BUILDINGS_FOR_MAP: TypedDocumentNode<{
  buildingsForMap: BuildingForMap[];
}> = gql`
  query getBuildingsForMap {
    buildingsForMap {
      id
      name
      latitude
      longitude
      propertyClass
      complex {
        name
      }
    }
  }
`;

export const CREATE_BUILDING: TypedDocumentNode<
  {
    createBuilding: Building;
  },
  { input: BuildingInputSchema }
> = gql`
  mutation createBuilding($input: BuildingInput!) {
    createBuilding(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_BUILDING: TypedDocumentNode<
  { updateBuilding: Building },
  { id: number; input: BuildingInputSchema }
> = gql`
  mutation updateBuilding($id: Int!, $input: BuildingInput!) {
    updateBuilding(id: $id, input: $input) {
      id
      name
    }
  }
`;

export const DELETE_BUILDING: TypedDocumentNode<{ deleteBuilding: Building }, { id: number }> = gql`
  mutation deleteBuilding($id: Int!) {
    deleteBuilding(id: $id) {
      id
      name
    }
  }
`;
