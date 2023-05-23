import { gql, TypedDocumentNode } from '@apollo/client';

import {
  BuildingWithoutSales,
  PropAggregateResponse,
  PropertyClass,
  PropertyType,
  Sale,
  SaleInput,
  SalesAnalyticsResponse,
  SalesDataResponse,
  SalesSumByPropertyType,
} from '~/shared/models/gql/graphql';

export const SAVE_SALES: TypedDocumentNode<
  {
    saveSales: Sale[];
  },
  { input: SaleInput[] }
> = gql`
  mutation saveSales($input: [SaleInput!]!) {
    saveSales(input: $input) {
      id
      area
      amount
      sum
      year
      month
      buildingId
    }
  }
`;

export const SALES_DATA: TypedDocumentNode<
  {
    salesData: SalesDataResponse;
  },
  {
    propertyType: PropertyType;
    year: number;
    month: number;
    propertyClass?: PropertyClass;
    districtId?: number;
    favorites?: number[];
  }
> = gql`
  query getSalesData(
    $propertyType: PropertyType!
    $year: Int!
    $month: Int!
    $propertyClass: PropertyClass
    $districtId: Int
    $favorites: [Int!]
  ) {
    salesData(
      propertyType: $propertyType
      year: $year
      month: $month
      favorites: $favorites
      propertyClass: $propertyClass
      districtId: $districtId
    ) {
      year
      month
      groups {
        id
        name
        sales {
          number
          area
          price
        }
        complexes {
          id
          name
          groupName
          sales {
            number
            area
            price
          }
          buildings {
            id
            name
            completionDate
            complexName
            groupName
            sales {
              number
              area
              price
            }
          }
        }
      }
    }
  }
`;

export const SALES_ANALYTICS: TypedDocumentNode<
  {
    salesAnalytics: SalesAnalyticsResponse[];
    propAggregate: PropAggregateResponse;
    salesSumByPropertyType: SalesSumByPropertyType;
  },
  {
    propertyType: PropertyType;
    buildingIds?: number[];
    propertyClass?: PropertyClass;
    districtId?: number;
  }
> = gql`
  query getSalesAnalytics(
    $propertyType: PropertyType!
    $buildingIds: [Int!]!
    $propertyClass: PropertyClass
    $districtId: Int
  ) {
    salesAnalytics(
      propertyType: $propertyType
      buildingIds: $buildingIds
      propertyClass: $propertyClass
      districtId: $districtId
    ) {
      date
      area
      amount
      sum
    }
    propAggregate(
      buildingIds: $buildingIds
      propertyClass: $propertyClass
      districtId: $districtId
    ) {
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
    salesSumByPropertyType(
      buildingIds: $buildingIds
      propertyClass: $propertyClass
      districtId: $districtId
    ) {
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
  }
`;

export const BUILDINGS_WITHOUT_SALES: TypedDocumentNode<
  {
    buildingsWithoutSales: BuildingWithoutSales[];
  },
  {
    date: string;
  }
> = gql`
  query getBuildingsWithoutSales($date: String!) {
    buildingsWithoutSales(date: $date) {
      id
      name
      completionDate
      domRfId
      domClickId
      tags
    }
  }
`;
