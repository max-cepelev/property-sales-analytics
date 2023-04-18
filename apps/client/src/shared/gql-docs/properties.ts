import { gql, TypedDocumentNode } from '@apollo/client';
import { Property, PropertyInput } from '~/shared/models/gql/graphql';

export const SAVE_ALL_PROPERTIES: TypedDocumentNode<
  {
    updateProperties: Property[];
  },
  { input: PropertyInput[] }
> = gql`
  mutation saveProps($input: [PropertyInput!]!) {
    updateProperties(input: $input) {
      id
      buildingId
    }
  }
`;
