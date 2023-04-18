import { useMemo } from 'react';
import AutocompleteSelector from '~/shared/components/selectors/AutocompleteSelector';
import useGroupsService from '../../entities/Group/api/useGroupsService';

interface Props {
  currentId: number | null;
  onSelect: (id: number | null) => void;
  error?: boolean;
  fullWidth?: boolean;
  helperText?: string;
  ref?: React.Ref<unknown>;
}

export default function GroupAutocompleteSelector({
  currentId,
  onSelect,
  fullWidth,
  error,
  helperText,
}: Props) {
  const { groups, loading } = useGroupsService();
  const current = useMemo(
    () => groups.find((item) => item.id == currentId) || null,
    [currentId, groups],
  );
  return (
    <AutocompleteSelector
      options={groups}
      error={error}
      loading={loading}
      current={current}
      onChange={(option) => onSelect(option?.id || null)}
      name='Группа компаний'
      fullWidth={fullWidth}
      helperText={helperText}
      getOptionLabel={(option) => option.name || 'Не задано'}
    />
  );
}
