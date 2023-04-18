import { useQuery } from '@apollo/client';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from '~/shared/lib/MUI';
import { useMemo, useState } from 'react';
import RowWrapper from '~/shared/ui/RowWrapper';
import CitySelector from '~/entities/City/components/CitySelector';
import DistrictSelector from '~/entities/District/components/DistrictSelector';
import { getQuarter } from '~/shared/utils/getQuarter';
import { useSelectorStore } from '~/shared/store/useSelectorStore';
import { BUILDINGS_FOR_SELECTOR } from '~/shared/gql-docs/buildings';
import GroupAutocompleteSelector from '~/features/selectors/GroupAutocompleteSelector';

export interface Props {
  open: boolean;
  onClose: () => void;
  onSelect?: (id: number) => void;
  onMultiSelect?: (ids: number[]) => void;
  disabledItems?: boolean;
  multiple?: boolean;
}

export default function BuildingSelectorDialog({
  open,
  onSelect,
  onClose,
  onMultiSelect,
  disabledItems = true,
  multiple = false,
}: Props) {
  const [term, setTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const currentCityId = useSelectorStore((store) => store.cityId);
  const districtId = useSelectorStore((store) => store.districtId);
  const currentGroupId = useSelectorStore((store) => store.groupId);

  const { data } = useQuery(BUILDINGS_FOR_SELECTOR, {
    variables: {
      groupId: currentGroupId ?? undefined,
      cityId: currentCityId ?? undefined,
      districtId: districtId ?? undefined,
    },
  });

  const setCurrentCityId = useSelectorStore((store) => store.setCityId);
  const setDistrictId = useSelectorStore((store) => store.setDistrictId);
  const setCurrentGroupId = useSelectorStore((store) => store.setGroupId);

  const filteredData = useMemo(
    () =>
      !term
        ? data?.buildings || []
        : data?.buildings.filter(
            (item) =>
              item.name!.toLowerCase().includes(term) ||
              item.complex!.name.toLowerCase().includes(term) ||
              (item.address && item.address.toLowerCase().includes(term)),
          ) || [],
    [data, term],
  );

  const handleObjectSelect = (id: number) => {
    onSelect && onSelect(id);
    onClose();
    setTerm('');
  };

  const handleObjectsSelect = (ids: number[]) => {
    onMultiSelect && onMultiSelect(ids);
    onClose();
    setTerm('');
    setSelectedIds([]);
  };

  const handleToggle = (id: number) => {
    if (selectedIds.includes(id)) {
      const newItems = selectedIds.filter((item) => item !== id);
      setSelectedIds(newItems);
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle component={'div'} sx={{ display: 'flex', flexDirection: 'column', rowGap: 1 }}>
        <span>Выбор дома</span>
        <RowWrapper>
          <CitySelector
            fullWidth
            size='small'
            currentId={currentCityId}
            onSelect={(id) => setCurrentCityId(id)}
          />
          <DistrictSelector
            fullWidth
            nullSelect
            cityId={currentCityId}
            size='small'
            currentId={districtId}
            onSelect={(id) => setDistrictId(id)}
          />
        </RowWrapper>
        <GroupAutocompleteSelector
          currentId={currentGroupId}
          onSelect={(id) => setCurrentGroupId(id)}
          fullWidth
        />
        <TextField
          size='small'
          fullWidth
          value={term}
          placeholder='Начните печатать'
          onChange={(e) => setTerm(e.target.value)}
        />
      </DialogTitle>
      <DialogContent>
        <List
          sx={{
            minWidth: '20vw',
            maxHeight: 450,
            overflow: 'auto',
            transition: 'ease-in-out all 0.4s',
          }}
        >
          {filteredData.length > 0 ? (
            multiple ? (
              filteredData.map((item) => (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleToggle(item.id)}
                    dense
                    disabled={disabledItems && !item.domClickId}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge='start'
                        checked={selectedIds.includes(item.id)}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      secondary={`${item.complex!.name} (${
                        item.completionDate ? getQuarter(item.completionDate) : 'не задан'
                      })`}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              filteredData.map((item) => (
                <ListItemButton
                  key={item.id}
                  disabled={disabledItems && !item.domClickId}
                  onClick={() => handleObjectSelect(item.id)}
                  dense
                >
                  <ListItemText
                    primary={item.name}
                    secondary={`${item.complex!.name} (${
                      item.completionDate ? getQuarter(item.completionDate) : 'не задан'
                    })`}
                  />
                </ListItemButton>
              ))
            )
          ) : (
            <ListItem>
              <ListItemText primary='Список пуст' />
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        {multiple && (
          <>
            <Button disabled={selectedIds.length === 0} onClick={() => setSelectedIds([])}>
              Очистить
            </Button>
            <Button
              disabled={selectedIds.length === 0}
              onClick={() => handleObjectsSelect(selectedIds)}
            >
              Выбрать
            </Button>
          </>
        )}
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
}
