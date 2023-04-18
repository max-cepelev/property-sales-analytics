import useNotification from '../../../shared/hooks/useNotification';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { ACTIVATE_USER, DEACTIVATE_USER, USERS } from '~/shared/gql-docs/users';

export default function useUsersService() {
  const { successNotice, errorNotice } = useNotification();

  const { data, loading } = useQuery(USERS);

  const [activate, { loading: isActivating }] = useMutation(ACTIVATE_USER, {
    onCompleted() {
      successNotice('Активирован');
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: USERS }, 'getUsers'],
  });

  const [deactivate, { loading: isDeactivating }] = useMutation(DEACTIVATE_USER, {
    onCompleted() {
      successNotice('Деактивирован');
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: USERS }, 'getUsers'],
  });

  return {
    users: data?.users || [],
    activate,
    deactivate,
    isActivating,
    isDeactivating,
    loading,
  };
}
