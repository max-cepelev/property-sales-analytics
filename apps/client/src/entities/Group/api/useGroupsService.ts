import { ApolloError, gql, useMutation, useQuery } from '@apollo/client';
import useNotification from '~/shared/hooks/useNotification';
import { Group } from '~/shared/models/gql/graphql';

const GROUPS = gql`
  query getGroups {
    groups {
      id
      name
      regions {
        name
      }
    }
  }
`;

const CREATE_GROUP = gql`
  mutation createGroup($name: String!) {
    createGroup(name: $name) {
      id
      name
    }
  }
`;

const UPDATE_GROUP = gql`
  mutation updateGroup($id: Int!, $name: String!) {
    updateGroup(id: $id, name: $name) {
      id
      name
    }
  }
`;

const DELETE_GROUP = gql`
  mutation deleteGroup($id: Int!) {
    deleteGroup(id: $id) {
      id
      name
    }
  }
`;

export default function useGroupsService() {
  const { successNotice, errorNotice } = useNotification();

  const { data, loading } = useQuery<{ groups: Group[] }>(GROUPS);

  const [create, { loading: isCreating }] = useMutation<
    {
      data: {
        createGroup: Group;
      };
    },
    { name: string }
  >(CREATE_GROUP, {
    onCompleted() {
      successNotice('Создана новая группа компаний');
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: GROUPS }, 'getGroups'],
  });

  const [update, { loading: isUpdateing }] = useMutation<
    {
      data: {
        updateGroup: Group;
      };
    },
    { id: number; name: string }
  >(UPDATE_GROUP, {
    onCompleted() {
      successNotice('Сохранено');
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: GROUPS }, 'getGroups'],
  });

  const [remove, { loading: isDeleting }] = useMutation<any, { id: number }>(DELETE_GROUP, {
    onCompleted() {
      successNotice('Удалено');
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: GROUPS }, 'getGroups'],
  });

  return {
    groups: data?.groups || [],
    create,
    update,
    remove,
    isDeleting,
    isUpdateing,
    isCreating,
    loading,
  };
}
