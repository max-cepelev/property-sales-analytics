import { TypedDocumentNode, gql } from '@apollo/client';
import { Developer } from '../models/gql/graphql';

export const DEVELOPERS: TypedDocumentNode<{ developers: Developer[] }, { groupId?: number }> = gql`
  query getDevelopers($groupId: Int) {
    developers(groupId: $groupId) {
      id
      name
      fullName
      legalAddress
      actualAddress
      inn
      kpp
      ogrn
      manager
      website
      phone
      email
      info
      groupId
      group {
        name
      }
    }
  }
`;

export const DEVELOPERS_FOR_SELECTOR: TypedDocumentNode<
  { developers: Pick<Developer, 'id' | 'name'>[] },
  { groupId?: number }
> = gql`
  query getDevelopersForSelector($groupId: Int) {
    developers(groupId: $groupId) {
      id
      name
    }
  }
`;

export const CREATE_DEVELOPER = gql`
  mutation createDeveloper($input: DeveloperInput!) {
    createDeveloper(input: $input) {
      id
      name
      groupId
    }
  }
`;

export const UPDATE_DEVELOPER = gql`
  mutation updateDeveloper($id: Int!, $input: DeveloperInput!) {
    updateDeveloper(id: $id, input: $input) {
      id
      name
    }
  }
`;

export const DELETE_DEVELOPER = gql`
  mutation deleteDeveloper($id: Int!) {
    deleteDeveloper(id: $id) {
      id
      name
    }
  }
`;
