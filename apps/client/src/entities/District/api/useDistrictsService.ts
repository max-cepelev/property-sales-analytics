import { ApolloError, gql, useMutation, useQuery } from '@apollo/client';
import useNotification from '~/shared/hooks/useNotification';
import { District, DistrictInput } from '~/shared/models/gql/graphql';

const DISTRICTS = gql`
  query getDistricts($cityId: Int) {
    districts(cityId: $cityId) {
      id
      name
      cityId
      city {
        name
      }
    }
  }
`;

const CREATE_DISTRICT = gql`
  mutation createDistrict($input: DistrictInput!) {
    createDistrict(input: $input) {
      id
      name
    }
  }
`;

const UPDATE_DISTRICT = gql`
  mutation updateDistrict($id: Int!, $input: DistrictInput!) {
    updateDistrict(id: $id, input: $input) {
      id
      name
    }
  }
`;

const DELETE_DISTRICT = gql`
  mutation deleteDistrict($id: Int!) {
    deleteDistrict(id: $id) {
      id
      name
    }
  }
`;

export default function useDistrictsService(cityId?: number | null) {
  const { successNotice, errorNotice } = useNotification();

  const { data, loading } = useQuery<{ districts: District[] }, { cityId?: number }>(DISTRICTS, {
    variables: { cityId: cityId ?? undefined },
  });

  const [create, { loading: isCreating }] = useMutation<
    {
      data: {
        createDistrict: District;
      };
    },
    { input: DistrictInput }
  >(CREATE_DISTRICT, {
    onCompleted() {
      successNotice('Создан новый район');
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: DISTRICTS }, 'getDistricts'],
  });

  const [update, { loading: isUpdateing }] = useMutation<
    {
      data: {
        updateDistrict: District;
      };
    },
    { id: number; input: DistrictInput }
  >(UPDATE_DISTRICT, {
    onCompleted() {
      successNotice('Сохранено');
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: DISTRICTS }, 'getDistricts'],
  });

  const [remove, { loading: isDeleting }] = useMutation<any, { id: number }>(DELETE_DISTRICT, {
    onCompleted() {
      successNotice('Удалено');
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: DISTRICTS }, 'getDistricts'],
  });

  return {
    districts: data?.districts || [],
    create,
    update,
    remove,
    isDeleting,
    isUpdateing,
    isCreating,
    loading,
  };
}
