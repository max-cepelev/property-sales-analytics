import { gql, TypedDocumentNode } from '@apollo/client';
import { User } from '../models/gql/graphql';

export const USERS: TypedDocumentNode<{
  users: Pick<User, 'id' | 'email' | 'phone' | 'name' | 'role' | 'activated'>[];
}> = gql`
  query getUsers {
    users {
      id
      email
      name
      phone
      role
      activated
    }
  }
`;

export const ACTIVATE_USER: TypedDocumentNode<
  {
    users: Pick<User, 'id' | 'email' | 'phone' | 'name' | 'role' | 'activated'>[];
  },
  { id: number }
> = gql`
  mutation activateUser($id: Int!) {
    activateUser(id: $id) {
      id
      email
      name
      phone
      role
    }
  }
`;

export const DEACTIVATE_USER: TypedDocumentNode<
  {
    users: Pick<User, 'id' | 'email' | 'phone' | 'name' | 'role' | 'activated'>[];
  },
  { id: number }
> = gql`
  mutation deactivateUser($id: Int!) {
    deactivateUser(id: $id) {
      id
      email
      name
      phone
      role
    }
  }
`;
