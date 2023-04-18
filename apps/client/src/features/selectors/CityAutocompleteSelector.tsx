import { useMemo } from 'react';
import AutocompleteSelector from '~/shared/components/selectors/AutocompleteSelector';
import useCitiesService from '../../entities/City/api/useCitiesService';

interface Props {
  currentId: number | null;
  onSelect: (id: number | null) => void;
  fullWidth?: boolean;
}

export default function ContactSelector({ currentId, onSelect, fullWidth }: Props) {
  const { cities, loading } = useCitiesService();
  const current = useMemo(
    () => cities.find((item) => item.id == currentId) || null,
    [currentId, cities],
  );
  return (
    <AutocompleteSelector
      options={cities}
      loading={loading}
      current={current}
      onChange={(option) => onSelect(option?.id || null)}
      name='Контакт'
      fullWidth={fullWidth}
      getOptionLabel={(option) => option.name}
    />
  );
}
