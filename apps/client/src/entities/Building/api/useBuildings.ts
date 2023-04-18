import { ApolloError, useMutation, useQuery } from '@apollo/client';
import {
  BUILDINGS,
  CREATE_BUILDING,
  DELETE_BUILDING,
  UPDATE_BUILDING,
} from '~/shared/gql-docs/buildings';
import { useNavigate } from 'react-router-dom';
import useNotification from '~/shared/hooks/useNotification';

type Props = {
  completed?: boolean;
  complexId?: number | null;
  groupId?: number | null;
  districtId?: number | null;
  cityId?: number | null;
  onSuccess?: () => void;
};

export default function useBuildings({
  completed,
  complexId,
  groupId,
  districtId,
  cityId,
  onSuccess,
}: Props) {
  const { successNotice, errorNotice } = useNotification();
  const navigate = useNavigate();

  const { data: buildings, loading } = useQuery(BUILDINGS, {
    variables: {
      cityId: cityId ?? undefined,
      districtId: districtId ?? undefined,
      groupId: groupId ?? undefined,
      complexId: complexId ?? undefined,
      completed,
    },
  });

  const [create, { loading: isCreating }] = useMutation(CREATE_BUILDING, {
    onCompleted() {
      successNotice('Создано новое здание');
      onSuccess && onSuccess();
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: BUILDINGS }, 'getBuildings'],
  });

  const [update, { loading: isUpdating }] = useMutation(UPDATE_BUILDING, {
    onCompleted() {
      successNotice('Сохранено');
      onSuccess && onSuccess();
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: BUILDINGS }, 'getBuildings', 'getBuildingData'],
  });

  const [remove, { loading: isDeleting }] = useMutation(DELETE_BUILDING, {
    onCompleted() {
      successNotice('Удалено');
      onSuccess && onSuccess();
      navigate('/buildings');
    },
    onError(error: ApolloError) {
      errorNotice(error.message);
    },
    refetchQueries: [{ query: BUILDINGS }, 'getBuildings'],
  });

  return {
    buildings,
    loading,
    create,
    update,
    remove,
    isDeleting,
    isUpdating,
    isCreating,
  };
}
