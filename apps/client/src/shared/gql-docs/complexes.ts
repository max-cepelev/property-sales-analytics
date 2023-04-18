import { TypedDocumentNode, gql } from '@apollo/client';
import { Complex } from '../models/gql/graphql';

export const COMPLEXES: TypedDocumentNode<
  { complexes: Complex[] },
  { groupId?: number; districtId?: number; cityId?: number }
> = gql`
  query getComplexes($groupId: Int, $districtId: Int, $cityId: Int) {
    complexes(groupId: $groupId, districtId: $districtId, cityId: $cityId) {
      id
      name
      shortName
      website
      info
      domRfId
      domClickId
      groupId
      cityId
      districtId
      group {
        name
      }
      city {
        name
      }
      district {
        name
      }
    }
  }
`;

export const COMPLEXES_FOR_SELECTOR: TypedDocumentNode<
  { complexes: Pick<Complex, 'id' | 'name'>[] },
  { groupId?: number; districtId?: number; cityId?: number }
> = gql`
  query getComplexesForSelector($groupId: Int, $districtId: Int, $cityId: Int) {
    complexes(groupId: $groupId, districtId: $districtId, cityId: $cityId) {
      id
      name
    }
  }
`;

export const CREATE_COMPLEX = gql`
  mutation createComplex($input: ComplexInput!) {
    createComplex(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_COMPLEX = gql`
  mutation updateComplex($id: Int!, $input: ComplexInput!) {
    updateComplex(id: $id, input: $input) {
      id
      name
    }
  }
`;

export const DELETE_COMPLEX = gql`
  mutation deleteComplex($id: Int!) {
    deleteComplex(id: $id) {
      id
      name
    }
  }
`;
