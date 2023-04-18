import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
  TextField,
} from '~/shared/lib/MUI';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import CitySelector from '~/entities/City/components/CitySelector';
import ConfirmModal from '~/shared/components/dialogs/ConfirmModal';
import DistrictSelector from '~/entities/District/components/DistrictSelector';
import {
  complexInputSchema,
  ComplexInputSchema,
} from '~/entities/Complex/schema/complexInputSchema';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import GroupAutocompleteSelector from '../selectors/GroupAutocompleteSelector';

interface Props {
  open: boolean;
  complex?: ComplexInputSchema | null;
  onSave: (complex: ComplexInputSchema) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

const Wrapper = styled('div')(() => ({
  display: 'grid',
  marginTop: '10px',
  width: 'clamp(350px, 70vw, 700px)',
  gridTemplateAreas: `
    'city       name name'
    'area       name name'
    'group      shortName shortName'
    'domClickId shortName shortName'
    'domRfId    info      info'
    'website    info      info'`,
  gap: '15px',
}));

const defaultValues: ComplexInputSchema = {
  name: '',
  shortName: null,
  website: null,
  info: null,
  domRfId: null,
  domClickId: null,
  cityId: null,
  districtId: null,
  groupId: null,
};

export default function ComplexEditDialog({ open, complex, onClose, onDelete, onSave }: Props) {
  const [values, setValues] = useState(defaultValues);
  const [confirmModal, setConformModal] = useState(false);

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
    control,
    getValues,
  } = useForm<ComplexInputSchema>({
    mode: 'onChange',
    resolver: zodResolver(complexInputSchema),
    values,
  });

  const onSubmitHandler: SubmitHandler<ComplexInputSchema> = (values) => {
    onSave(values);
  };

  const handleDelete = (id: number) => {
    onDelete(id);
    reset();
    setConformModal(false);
    onClose();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (complex) {
      setValues(complex);
    }
    return () => {
      setValues(defaultValues);
    };
  }, [complex]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      onClose();
      setValues(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  return (
    <Dialog onClose={onClose} open={open} maxWidth='xl'>
      <DialogTitle sx={{ textAlign: 'center' }}>{complex ? complex.name : ''}</DialogTitle>
      <DialogContent>
        <Wrapper>
          <TextField
            sx={{ gridArea: 'name' }}
            fullWidth
            size='small'
            InputProps={{ sx: { height: '100%' } }}
            multiline
            required
            rows={3}
            label='Наименование'
            error={!!errors['name']}
            helperText={errors['name'] ? errors['name'].message : ''}
            {...register('name', { required: true })}
          />
          <TextField
            sx={{ gridArea: 'shortName', height: '100%' }}
            fullWidth
            size='small'
            InputProps={{ sx: { height: '100%' } }}
            multiline
            rows={3}
            label='Сокращенное наименование'
            {...register('shortName')}
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
          <Box gridArea='area'>
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
                  cityId={getValues('cityId') || undefined}
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
                  currentId={value}
                  error={fieldState.invalid}
                  onSelect={(id) => onChange(id)}
                />
              )}
            />
          </Box>
          <TextField
            sx={{ gridArea: 'domRfId' }}
            size='small'
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            type='number'
            label='ДомРФ ID'
            {...register('domRfId')}
          />
          <TextField
            sx={{ gridArea: 'domClickId' }}
            size='small'
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            type='number'
            label='ДомКлик ID'
            {...register('domClickId')}
          />
          <TextField
            sx={{ gridArea: 'website' }}
            fullWidth
            size='small'
            label='Сайт'
            {...register('website')}
          />
          <TextField
            sx={{ gridArea: 'info' }}
            fullWidth
            size='small'
            multiline
            rows={3}
            InputProps={{ sx: { height: '100%' } }}
            label='Описание'
            {...register('info')}
          />
        </Wrapper>
      </DialogContent>
      <DialogActions>
        {values.id && (
          <Button color='error' onClick={() => setConformModal(true)}>
            Удалить
          </Button>
        )}
        <Button onClick={handleCancel}>Отмена</Button>
        <Button onClick={handleSubmit(onSubmitHandler)}>Сохранить</Button>
      </DialogActions>
      <ConfirmModal
        open={confirmModal}
        onConfirm={() => values.id && handleDelete(values.id)}
        onClose={() => setConformModal(false)}
      />
    </Dialog>
  );
}
