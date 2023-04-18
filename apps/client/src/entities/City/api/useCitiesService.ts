import { ApolloError, gql, useMutation, useQuery } from '@apollo/client';
import useNotification from '~/shared/hooks/useNotification';
import { City, CityInput } from '~/shared/models/gql/graphql';

const CITIES = gql`
  query getCities($regionId: Int) {
    cities(regionId: $regionId) {
      id
      name
      regionId
      region {
        name
      }
    }
  }
`;

const CREATE_CITY = gql`
  mutation createCity($input: CityInput!) {
    createCity(input: $input) {
      id
      name
    }
  }
`;

const UPDATE_CITY = gql`
  mutation updateCity($id: Int!, $input: CityInput!) {
    updateCity(id: $id, input: $input) {
      id
      name
    }
  }
`;

const DELETE_CITY = gql`
  mutation deleteCity($id: Int!) {
    removeCity(id: $id) {
      id
      name
    }
  }
`;

export default function useCitiesService(regionId?: number | null) {
  const { successNotice, errorNotice } = useNotification();

  const { data, loading } = useQuery<{ cities: City[] }, { regionId?: number }>(CITIES, {
    variables: { regionId: regionId ?? undefined },
  });

  const [create, { loading: isCreating }] = useMutation<
    {
      data: {
        createCity: City;
      };
    },
    { input: CityInput }
  >(CREATE_CITY, {
    onCompleted() {
      successNotice('Создан новый город');
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: CITIES }, 'getCities'],
  });

  const [update, { loading: isUpdateing }] = useMutation<
    {
      data: {
        updateCity: City;
      };
    },
    { id: number; input: CityInput }
  >(UPDATE_CITY, {
    onCompleted() {
      successNotice('Сохранено');
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: CITIES }, 'getCities'],
  });

  const [remove, { loading: isDeleting }] = useMutation<any, { id: number }>(DELETE_CITY, {
    onCompleted() {
      successNotice('Удалено');
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: CITIES }, 'getCities'],
  });

  return {
    cities: data?.cities || [],
    create,
    update,
    remove,
    isDeleting,
    isUpdateing,
    isCreating,
    loading,
  };
}
