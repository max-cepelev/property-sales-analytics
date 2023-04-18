import { ApolloError, gql, useMutation, useQuery } from '@apollo/client';
import useNotification from '~/shared/hooks/useNotification';
import { Region } from '~/shared/models/gql/graphql';

const REGIONS = gql`
  query getRegions {
    regions {
      id
      name
    }
  }
`;

const CREATE_REGION = gql`
  mutation createRegion($name: String!) {
    createRegion(input: { name: $name }) {
      id
      name
    }
  }
`;

const UPDATE_REGION = gql`
  mutation updateRegion($id: Int!, $name: String!) {
    updateRegion(id: $id, input: { name: { set: $name } }) {
      id
      name
    }
  }
`;

const DELETE_REGION = gql`
  mutation deleteRegion($id: Int!) {
    removeRegion(id: $id) {
      id
      name
    }
  }
`;

export default function useRegionsService() {
  const { successNotice, errorNotice } = useNotification();

  const { data, loading } = useQuery<{ regions: Region[] }>(REGIONS);

  const [create, { loading: isCreating }] = useMutation<
    {
      data: {
        createRegion: Region;
      };
    },
    { name: string }
  >(CREATE_REGION, {
    onCompleted() {
      successNotice('Создан новый регион');
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: REGIONS }, 'getRegions'],
  });

  const [update, { loading: isUpdateing }] = useMutation<
    {
      data: {
        updateRegion: Region;
      };
    },
    { id: number; name: string }
  >(UPDATE_REGION, {
    onCompleted() {
      successNotice('Сохранено');
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: REGIONS }, 'getRegions'],
  });

  const [remove, { loading: isDeleting }] = useMutation<any, { id: number }>(DELETE_REGION, {
    onCompleted() {
      successNotice('Удалено');
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: REGIONS }, 'getRegions'],
  });

  return {
    regions: data?.regions || [],
    create,
    update,
    remove,
    isDeleting,
    isUpdateing,
    isCreating,
    loading,
  };
}
