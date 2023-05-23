import { zodResolver } from '@hookform/resolvers/zod';
import { mdiClose } from '@mdi/js';
import { Icon } from '@mdi/react';
import { IconButton, InputAdornment, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import {
  BuildingInputSchema,
  buildingInputSchema,
} from '~/entities/Building/schema/buildingInputSchema';
import CitySelector from '~/entities/City/components/CitySelector';
import DistrictSelector from '~/entities/District/components/DistrictSelector';
import ConfirmModal from '~/shared/components/dialogs/ConfirmModal';
import DateSelector from '~/shared/components/selectors/DateSelector';
import LocationSelector from '~/shared/components/selectors/LocationSelector';
import Selector from '~/shared/components/selectors/Selector';
import { DecorTypes, PropertyClasses, WallMaterials } from '~/shared/constants/enums';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  styled,
  TextField,
} from '~/shared/lib/MUI';

import ComplexAutocompleteSelector from '../selectors/ComplexAutocompleteSelector';
import DeveloperAutocompleteSelector from '../selectors/DeveloperAutocompleteSelector';
import GroupAutocompleteSelector from '../selectors/GroupAutocompleteSelector';

const DialogWrapper = styled('div')(() => ({
  display: 'grid',
  marginTop: '10px',
  width: 'min-content',
  gridTemplateColumns: 'minmax(170px, 400px) repeat(3, max-content)',
  gridTemplateAreas: `
  'name    name      city      wall'
  'date    completed district  class'
  'image   image     group     decor'
  'address address   developer domRfId'
  'address address   complex   domClickId'
  'map     map       map       map'
  `,
  gap: '10px',
}));

const defaultValues: BuildingInputSchema = {
  name: '',
  address: '',
  completionDate: null,
  completed: false,
  propertyClass: null,
  wallMaterial: null,
  decorType: null,
  latitude: null,
  longitude: null,
  img: null,
  domClickId: null,
  domRfId: null,
  cityId: null,
  developerId: null,
  complexId: null,
  districtId: null,
  groupId: null,
};

type Props = {
  open: boolean;
  building?: BuildingInputSchema | null;
  onSave: (values: BuildingInputSchema) => void;
  onDelete?: (id: number) => void;
  onClose: () => void;
  permission: boolean;
};

export default function BuildingInputDialog({
  open,
  building,
  onClose,
  permission,
  onSave,
  onDelete,
}: Props) {
  const [confirmModal, setConformModal] = useState(false);
  const [state, setState] = useState<BuildingInputSchema>(defaultValues);

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
    control,
    watch,
    setValue,
  } = useForm<BuildingInputSchema>({
    mode: 'onChange',
    resolver: zodResolver(buildingInputSchema),
    values: state,
  });

  const onSubmitHandler: SubmitHandler<BuildingInputSchema> = (values) => {
    onSave(values);
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (building) {
      setState(building);
    }
    return () => {
      setState(defaultValues);
    };
  }, [building]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      onClose();
      setState(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  return (
    <Dialog onClose={onClose} open={permission && open} maxWidth='xl'>
      <DialogTitle sx={{ textAlign: 'center' }}>{building ? building.name : ''}</DialogTitle>
      <DialogContent sx={{ width: '100%' }}>
        <DialogWrapper>
          <TextField
            size='small'
            sx={{ gridArea: 'name' }}
            required
            label='Наименование'
            error={!!errors['name']}
            helperText={errors['name'] ? errors['name'].message : ''}
            {...register('name', { required: true })}
          />
          <TextField
            size='small'
            sx={{ gridArea: 'address' }}
            required
            label='Адрес'
            multiline
            InputProps={{ sx: { height: '100%' } }}
            rows={3}
            error={!!errors['address']}
            helperText={errors['address'] ? errors['address'].message : ''}
            {...register('address', { required: true })}
          />
          <Box gridArea='date'>
            <Controller
              control={control}
              name='completionDate'
              rules={{
                required: 'required field',
              }}
              render={({ field: { onChange, value }, fieldState }) => (
                <DateSelector
                  name='completionDate'
                  openTo='month'
                  label='Срок сдачи'
                  size='small'
                  views={['year', 'month']}
                  value={value || null}
                  error={fieldState.invalid}
                  // helperText={fieldState.error?.message}
                  onChange={onChange}
                />
              )}
            />
          </Box>
          <Box gridArea='wall'>
            <Controller
              control={control}
              name='wallMaterial'
              rules={{
                required: 'required field',
              }}
              render={({ field: { onChange, value }, fieldState }) => (
                <Selector
                  options={Object.entries(WallMaterials).map(([id, name]) => ({ id, name }))}
                  value={value || null}
                  fullWidth
                  error={fieldState.invalid}
                  onChange={(key) => onChange(key)}
                  label='Материал стен'
                />
              )}
            />
          </Box>
          <Box gridArea='class'>
            <Controller
              control={control}
              name='propertyClass'
              rules={{
                required: 'required field',
              }}
              render={({ field: { onChange, value }, fieldState }) => (
                <Selector
                  value={value || null}
                  options={Object.entries(PropertyClasses).map(([id, name]) => ({ id, name }))}
                  fullWidth
                  error={fieldState.invalid}
                  onChange={(key) => onChange(key)}
                  label='Класс недвижимости'
                />
              )}
            />
          </Box>
          <Box gridArea='decor'>
            <Controller
              control={control}
              name='decorType'
              rules={{
                required: 'required field',
              }}
              render={({ field: { onChange, value }, fieldState }) => (
                <Selector
                  fullWidth
                  options={Object.entries(DecorTypes).map(([id, name]) => ({ id, name }))}
                  value={value || null}
                  error={fieldState.invalid}
                  onChange={(key) => onChange(key)}
                  label='Отделка'
                />
              )}
            />
          </Box>
          <TextField
            size='small'
            sx={{ gridArea: 'image' }}
            label='Ссылка на изображение'
            error={!!errors['img']}
            helperText={errors['img'] ? errors['img'].message : ''}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <Tooltip title='Очистить'>
                    <IconButton onClick={() => setValue('img', null)} size='small'>
                      <Icon path={mdiClose} size={1} />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            {...register('img')}
          />
          <FormControlLabel
            sx={{ gridArea: 'completed' }}
            {...register('completed')}
            control={<Checkbox />}
            label='Дом сдан'
          />
          <TextField
            size='small'
            sx={{ gridArea: 'domRfId' }}
            label='Дом РФ ID'
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            type='number'
            {...register('domRfId', { valueAsNumber: true })}
          />
          <TextField
            size='small'
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            type='number'
            sx={{ gridArea: 'domClickId' }}
            label='Домклик ID'
            {...register('domClickId', { valueAsNumber: true })}
          />
          <Box gridArea='city'>
            <Controller
              control={control}
              name='cityId'
              rules={{
                required: 'required field',
              }}
              render={({ field: { onChange, value }, fieldState }) => (
                <CitySelector
                  fullWidth
                  error={fieldState.invalid}
                  size='small'
                  currentId={value || 0}
                  onSelect={(id) => onChange(id)}
                />
              )}
            />
          </Box>
          <Box gridArea='district'>
            <Controller
              control={control}
              name='districtId'
              rules={{
                required: 'required field',
              }}
              render={({ field: { onChange, value }, fieldState }) => (
                <DistrictSelector
                  fullWidth
                  error={fieldState.invalid}
                  size='small'
                  disabled={watch().cityId === null}
                  cityId={watch().cityId || undefined}
                  currentId={value || 0}
                  onSelect={(id) => onChange(id)}
                />
              )}
            />
          </Box>
          <Box gridArea='group'>
            <Controller
              control={control}
              name='groupId'
              rules={{
                required: 'required field',
              }}
              render={({ field: { onChange, value }, fieldState }) => (
                <GroupAutocompleteSelector
                  fullWidth
                  helperText={fieldState.error?.message || ''}
                  currentId={value || null}
                  error={fieldState.invalid}
                  onSelect={(id) => onChange(id)}
                />
              )}
            />
          </Box>
          <Box gridArea='developer'>
            <Controller
              control={control}
              name='developerId'
              rules={{
                required: 'required field',
              }}
              render={({ field: { onChange, value }, fieldState }) => (
                <DeveloperAutocompleteSelector
                  fullWidth
                  groupId={watch().groupId}
                  helperText={fieldState.error?.message || ''}
                  disabled={watch().groupId === null}
                  currentId={value || null}
                  error={fieldState.invalid}
                  onSelect={(id) => onChange(id)}
                />
              )}
            />
          </Box>
          <Box gridArea='complex'>
            <Controller
              control={control}
              name='complexId'
              rules={{
                required: 'required field',
              }}
              render={({ field: { onChange, value }, fieldState }) => (
                <ComplexAutocompleteSelector
                  fullWidth
                  groupId={watch().groupId}
                  cityId={watch().cityId}
                  districtId={watch().districtId}
                  helperText={fieldState.error?.message || ''}
                  disabled={watch().groupId === null}
                  currentId={value || null}
                  error={fieldState.invalid}
                  onSelect={(id) => onChange(id)}
                />
              )}
            />
          </Box>
          <Box gridArea='map'>
            <LocationSelector
              latitude={watch().latitude || null}
              longitude={watch().longitude || null}
              onChange={(latitude, longitude) => {
                setValue('latitude', latitude);
                setValue('longitude', longitude);
              }}
            />
          </Box>
        </DialogWrapper>
      </DialogContent>
      <DialogActions>
        {onDelete && permission && state.id && (
          <Button color='error' onClick={() => setConformModal(true)}>
            Удалить
          </Button>
        )}
        <Button onClick={handleCancel}>Отмена</Button>
        <Button onClick={handleSubmit(onSubmitHandler)}>Сохранить</Button>
      </DialogActions>
      <ConfirmModal
        open={confirmModal}
        onConfirm={() => state.id && onDelete && onDelete(state.id)}
        onClose={() => setConformModal(false)}
      />
    </Dialog>
  );
}
