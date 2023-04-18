import { Button, Checkbox, FormControlLabel, IconButton, Typography } from '@mui/material';
import { TableToolbar } from '../shared/ui/StyledTableComponents';
import ToolbarButtonsWrapper from '../shared/ui/ToolbarButtonsWrapper';
import { useSelectorStore } from '~/shared/store/useSelectorStore';
import CitySelector from '~/entities/City/components/CitySelector';
import DistrictSelector from '~/entities/District/components/DistrictSelector';
import SearchInput from '~/features/SearchInput';
import { Icon } from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import ComplexAutocompleteSelector from '~/features/selectors/ComplexAutocompleteSelector';
import GroupAutocompleteSelector from '~/features/selectors/GroupAutocompleteSelector';

interface Props {
  permission: boolean;
  onAdd: () => void;
  completed: boolean | undefined;
  onSetCompleted: (completed: boolean | undefined) => void;
  onChangeSearchTerm: (value: string) => void;
}

export default function BuildingsTableToolbar({
  onAdd,
  permission,
  completed,
  onSetCompleted,
  onChangeSearchTerm,
}: Props) {
  const complexId = useSelectorStore((store) => store.complexId);
  const currentCityId = useSelectorStore((store) => store.cityId);
  const currentGroupId = useSelectorStore((store) => store.groupId);
  const districtId = useSelectorStore((store) => store.districtId);

  const setCurrentComplexId = useSelectorStore((store) => store.setComplexId);
  const setCurrentCityId = useSelectorStore((store) => store.setCityId);
  const setDistrictId = useSelectorStore((store) => store.setDistrictId);
  const setCurrentGroupId = useSelectorStore((store) => store.setGroupId);

  const handleCompletedChange = (checked: boolean, inWork: boolean) => {
    if (inWork) {
      checked ? onSetCompleted(false) : onSetCompleted(undefined);
    } else {
      checked ? onSetCompleted(true) : onSetCompleted(undefined);
    }
  };

  const handleReset = () => {
    setCurrentComplexId(null);
    setDistrictId(null);
    setCurrentGroupId(null);
    onSetCompleted(undefined);
  };

  return (
    <TableToolbar>
      <Typography variant='h6' sx={{ flexGrow: 1 }}>
        Дома
      </Typography>
      <ToolbarButtonsWrapper>
        <SearchInput onChangeSearchTerm={onChangeSearchTerm} />
        <Button onClick={handleReset}>Сбросить</Button>
        <FormControlLabel
          checked={completed !== undefined ? !completed : false}
          onChange={(_, checked) => handleCompletedChange(checked, true)}
          componentsProps={{
            typography: {
              color: (theme) => theme.palette.primary.main,
              whiteSpace: 'nowrap',
            },
          }}
          control={<Checkbox />}
          label='В работе'
        />
        <FormControlLabel
          checked={completed !== undefined ? completed : false}
          control={<Checkbox />}
          componentsProps={{
            typography: { color: (theme) => theme.palette.primary.main },
          }}
          label='Сданные'
          onChange={(_, checked) => handleCompletedChange(checked, false)}
        />
        <CitySelector
          size='small'
          currentId={currentCityId}
          onSelect={(id) => setCurrentCityId(id)}
        />
        <DistrictSelector
          size='small'
          currentId={districtId}
          cityId={currentCityId}
          nullSelect
          onSelect={(id) => setDistrictId(id)}
        />
        <GroupAutocompleteSelector
          currentId={currentGroupId}
          onSelect={(id) => setCurrentGroupId(id)}
        />
        <ComplexAutocompleteSelector
          cityId={currentCityId}
          districtId={districtId}
          groupId={currentGroupId}
          currentId={complexId}
          onSelect={(id) => setCurrentComplexId(id)}
        />
      </ToolbarButtonsWrapper>
      <IconButton disabled={!permission} color='secondary' onClick={onAdd}>
        <Icon path={mdiPlus} size={1} />
      </IconButton>
    </TableToolbar>
  );
}
