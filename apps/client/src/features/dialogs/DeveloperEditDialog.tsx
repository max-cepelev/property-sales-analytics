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
import ConfirmModal from '../../shared/components/dialogs/ConfirmModal';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  DeveloperInput,
  developerInputSchema,
} from '~/entities/Developer/schema/developerInputSchema';
import GroupAutocompleteSelector from '../selectors/GroupAutocompleteSelector';
const Wrapper = styled('div')(() => ({
  display: 'grid',
  marginTop: '10px',
  width: 'clamp(350px, 70vw, 800px)',
  gridTemplateAreas: `
    'selector  name          name'
    'inn       fullName      fullName'
    'kpp       fullName      fullName'
    'ogrn      legalAddress  legalAddress'
    'email     legalAddress  legalAddress'
    'phone     actualAddress actualAddress'
    'website   actualAddress actualAddress'
    'manager   info          info'
  `,
  gap: '15px',
}));

interface Props {
  open: boolean;
  developer?: DeveloperInput;
  onSave: (developer: DeveloperInput) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

const defaultValues: DeveloperInput = {
  name: '',
  fullName: '',
  legalAddress: null,
  actualAddress: null,
  inn: '',
  kpp: null,
  ogrn: null,
  email: null,
  phone: null,
  manager: null,
  website: null,
  info: null,
  groupId: null,
};

export default function DeveloperEditDialog({ open, developer, onClose, onDelete, onSave }: Props) {
  const [confirmModal, setConformModal] = useState(false);
  const [values, setValues] = useState(defaultValues);

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
    control,
  } = useForm<DeveloperInput>({
    mode: 'onChange',
    resolver: zodResolver(developerInputSchema),
    values,
  });

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
    if (developer) {
      setValues(developer);
    }
    return () => {
      setValues(defaultValues);
    };
  }, [developer]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      onClose();
      setValues(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<DeveloperInput> = (values) => {
    console.log(values);
    onSave(values);
  };

  return (
    <Dialog onClose={onClose} open={open} maxWidth='xl'>
      <DialogTitle sx={{ textAlign: 'center' }}>{developer ? developer.name : ''}</DialogTitle>
      <DialogContent>
        <Wrapper>
          <TextField
            sx={{ gridArea: 'name' }}
            fullWidth
            size='small'
            label='Наименование'
            required
            error={!!errors['name']}
            helperText={errors['name'] ? errors['name'].message : ''}
            {...register('name', { required: true })}
          />
          <TextField
            sx={{ gridArea: 'fullName' }}
            fullWidth
            size='small'
            required
            multiline
            rows={3}
            label='Полное наименование'
            error={!!errors['fullName']}
            helperText={errors['fullName'] ? errors['fullName'].message : ''}
            {...register('fullName', { required: true })}
          />
          <TextField
            sx={{ gridArea: 'legalAddress' }}
            fullWidth
            size='small'
            multiline
            rows={3}
            label='Юридический адрес'
            {...register('legalAddress')}
          />
          <TextField
            sx={{ gridArea: 'actualAddress' }}
            fullWidth
            size='small'
            multiline
            rows={3}
            label='Фактический адрес'
            {...register('actualAddress')}
          />
          <Box gridArea='selector'>
            <Controller
              control={control}
              name='groupId'
              rules={{
                required: 'required field',
              }}
              render={({ field: { onChange, value }, fieldState }) => (
                <GroupAutocompleteSelector
                  fullWidth
                  currentId={value}
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  onSelect={(id) => onChange(id)}
                />
              )}
            />
          </Box>
          <TextField
            sx={{ gridArea: 'inn' }}
            size='small'
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            type='number'
            label='ИНН'
            required
            error={!!errors['inn']}
            helperText={errors['inn'] ? errors['inn'].message : ''}
            {...register('inn', { required: true })}
          />
          <TextField
            sx={{ gridArea: 'kpp' }}
            size='small'
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            type='number'
            label='КПП'
            error={!!errors['kpp']}
            helperText={errors['kpp'] ? errors['kpp'].message : ''}
            {...register('kpp')}
          />
          <TextField
            sx={{ gridArea: 'ogrn' }}
            size='small'
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            type='number'
            label='ОГРН'
            error={!!errors['ogrn']}
            helperText={errors['ogrn'] ? errors['ogrn'].message : ''}
            {...register('ogrn')}
          />
          <TextField
            sx={{ gridArea: 'email' }}
            fullWidth
            size='small'
            label='E-mail'
            error={!!errors['email']}
            helperText={errors['email'] ? errors['email'].message : ''}
            {...register('email')}
          />
          <TextField
            sx={{ gridArea: 'phone' }}
            fullWidth
            size='small'
            label='Телефон'
            {...register('phone')}
          />
          <TextField
            sx={{ gridArea: 'website' }}
            fullWidth
            size='small'
            label='Сайт'
            {...register('website')}
          />
          <TextField
            sx={{ gridArea: 'manager' }}
            fullWidth
            size='small'
            label='Руководитель'
            {...register('manager')}
          />
          <TextField
            sx={{ gridArea: 'info' }}
            fullWidth
            size='small'
            label='Дополнительно'
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
