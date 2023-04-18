import { ApolloError, useMutation, useQuery } from '@apollo/client';
import useNotification from '~/shared/hooks/useNotification';
import { Developer } from '~/shared/models/gql/graphql';
import { DeveloperInput } from '../schema/developerInputSchema';
import {
  CREATE_DEVELOPER,
  DELETE_DEVELOPER,
  DEVELOPERS,
  UPDATE_DEVELOPER,
} from '~/shared/gql-docs/developers';

export default function useDevelopersService(groupId?: number | null) {
  const { successNotice, errorNotice } = useNotification();

  const { data, loading } = useQuery(DEVELOPERS, {
    variables: { groupId: groupId ?? undefined },
  });

  const [create, { loading: isCreating }] = useMutation<
    {
      data: {
        createDeveloper: Developer;
      };
    },
    { input: DeveloperInput }
  >(CREATE_DEVELOPER, {
    onCompleted() {
      successNotice('Застройщик добавлен');
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: DEVELOPERS }, 'getDevelopers'],
  });

  const [update, { loading: isUpdating }] = useMutation<
    {
      data: {
        updateDeveloper: Developer;
      };
    },
    { id: number; input: DeveloperInput }
  >(UPDATE_DEVELOPER, {
    onCompleted() {
      successNotice('Сохранено');
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: DEVELOPERS }, 'getDevelopers'],
  });

  const [remove, { loading: isDeleting }] = useMutation<any, { id: number }>(DELETE_DEVELOPER, {
    onCompleted() {
      successNotice('Удалено');
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: DEVELOPERS }, 'getDevelopers'],
  });

  return {
    developers: data?.developers || [],
    create,
    update,
    remove,
    isDeleting,
    isUpdating,
    isCreating,
    loading,
  };
}
