import { useMemo } from 'react';
import AutocompleteSelector from '~/shared/components/selectors/AutocompleteSelector';
import { useQuery } from '@apollo/client';
import { COMPLEXES_FOR_SELECTOR } from '~/shared/gql-docs/complexes';

interface Props {
  currentId: number | null;
  districtId?: number | null;
  cityId?: number | null;
  groupId?: number | null;
  onSelect: (id: number | null) => void;
  fullWidth?: boolean;
  error?: boolean;
  disabled?: boolean;
  helperText?: string;
}

export default function ComplexAutocompleteSelector({
  currentId,
  groupId,
  districtId,
  cityId,
  onSelect,
  fullWidth,
  error,
  disabled,
  helperText,
}: Props) {
  const { data = { complexes: [] }, loading } = useQuery(COMPLEXES_FOR_SELECTOR, {
    variables: {
      groupId: groupId ?? undefined,
      districtId: districtId ?? undefined,
      cityId: cityId ?? undefined,
    },
  });
  const current = useMemo(
    () => data.complexes.find((item) => item.id === currentId) || null,
    [currentId, data],
  );
  return (
    <AutocompleteSelector
      error={error}
      options={data.complexes}
      loading={loading}
      current={current}
      disabled={disabled}
      helperText={helperText}
      onChange={(option) => onSelect(option?.id || null)}
      name='Жилой комплекс'
      fullWidth={fullWidth}
      getOptionLabel={(option) => option.name || 'не задан'}
    />
  );
}
