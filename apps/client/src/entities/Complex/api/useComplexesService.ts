import { ApolloError, useMutation, useQuery } from '@apollo/client';
import useNotification from '~/shared/hooks/useNotification';
import { Complex } from '~/shared/models/gql/graphql';
import { ComplexInputSchema } from '../schema/complexInputSchema';
import {
  COMPLEXES,
  CREATE_COMPLEX,
  DELETE_COMPLEX,
  UPDATE_COMPLEX,
} from '~/shared/gql-docs/complexes';

export default function useComplexesService({
  groupId,
  districtId,
  cityId,
}: {
  groupId?: number | null;
  districtId?: number | null;
  cityId?: number | null;
}) {
  const { successNotice, errorNotice } = useNotification();

  const { data, loading } = useQuery(COMPLEXES, {
    variables: {
      groupId: groupId ?? undefined,
      districtId: districtId ?? undefined,
      cityId: cityId ?? undefined,
    },
  });

  const [create, { loading: isCreating }] = useMutation<
    {
      data: {
        createComplex: Complex;
      };
    },
    { input: ComplexInputSchema }
  >(CREATE_COMPLEX, {
    onCompleted() {
      successNotice('Добавлен новый ЖК');
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: COMPLEXES }, 'getComplexes'],
  });

  const [update, { loading: isUpdating }] = useMutation<
    {
      data: {
        updateComplex: Complex;
      };
    },
    { id: number; input: ComplexInputSchema }
  >(UPDATE_COMPLEX, {
    onCompleted() {
      successNotice('Сохранено');
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: COMPLEXES }, 'getComplexes'],
  });

  const [remove, { loading: isDeleting }] = useMutation<any, { id: number }>(DELETE_COMPLEX, {
    onCompleted() {
      successNotice('Удалено');
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: COMPLEXES }, 'getComplexes'],
  });

  return {
    complexes: data?.complexes || [],
    create,
    update,
    remove,
    isDeleting,
    isUpdating,
    isCreating,
    loading,
  };
}
