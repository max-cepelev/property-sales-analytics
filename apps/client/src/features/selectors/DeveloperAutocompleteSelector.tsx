import { useMemo } from 'react';
import AutocompleteSelector from '~/shared/components/selectors/AutocompleteSelector';
import { useQuery } from '@apollo/client';
import { DEVELOPERS_FOR_SELECTOR } from '~/shared/gql-docs/developers';

interface Props {
  currentId: number | null;
  groupId?: number | null;
  onSelect: (id: number | null) => void;
  fullWidth?: boolean;
  error?: boolean;
  disabled?: boolean;
  helperText?: string;
}

export default function DeveloperAutocompleteSelector({
  currentId,
  groupId,
  onSelect,
  fullWidth,
  error,
  helperText,
  disabled,
}: Props) {
  const { data = { developers: [] }, loading } = useQuery(DEVELOPERS_FOR_SELECTOR, {
    variables: { groupId: groupId ?? undefined },
  });
  const current = useMemo(
    () => data.developers.find((item) => item.id == currentId) || null,
    [currentId, data],
  );
  return (
    <AutocompleteSelector
      error={error}
      options={data.developers}
      loading={loading}
      current={current}
      disabled={disabled}
      helperText={helperText}
      onChange={(option) => onSelect(option?.id || null)}
      name='Застройщик'
      fullWidth={fullWidth}
      getOptionLabel={(option) => option.name}
    />
  );
}
