import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import RegionsSelector from '~/entities/Region/components/RegionsSelector';
import ConfirmModal from '~/shared/components/dialogs/ConfirmModal';
import { CityInput } from '~/shared/models/gql/graphql';
import ColumnWrapper from '~/shared/ui/ColumnWrapper';

interface Props {
  open: boolean;
  city: CityInput | null;
  cityId: number | undefined;
  onSave: (city: CityInput, id?: number) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

export default function CityEditDialog({ open, city, onClose, onDelete, onSave, cityId }: Props) {
  const [confirmModal, setConformModal] = useState(false);
  const [state, setState] = useState<CityInput | null>(null);

  const handleSave = () => {
    state && onSave(state, cityId);
    setState(null);
    onClose();
  };

  const handleDelete = (id: number) => {
    onDelete(id);
    setState(null);
    setConformModal(false);
    onClose();
  };

  const handleCancel = () => {
    setState(null);
    onClose();
  };

  useEffect(() => {
    if (city) {
      setState(city);
    }
  }, [city]);

  return (
    <Dialog onClose={onClose} open={open} maxWidth='xl'>
      <DialogTitle sx={{ textAlign: 'center' }}>{city ? city.name : ''}</DialogTitle>
      {state ? (
        <DialogContent>
          <ColumnWrapper sx={{ marginTop: 1, minWidth: 'clamp(300px, 20vw, 500px)' }}>
            <TextField
              value={state?.name || ''}
              name='name'
              label='Наименование'
              onChange={(e) => setState(() => ({ ...state, name: e.target.value }))}
            />
            <RegionsSelector
              error={state.regionId == 0}
              currentId={state.regionId}
              onSelect={(id) => setState(() => ({ ...state, regionId: id ? id : 0 }))}
            />
          </ColumnWrapper>
        </DialogContent>
      ) : null}

      <DialogActions>
        {cityId && (
          <Button color='error' onClick={() => setConformModal(true)}>
            Удалить
          </Button>
        )}
        <Button onClick={handleCancel}>Отмена</Button>
        <Button disabled={!state?.regionId} onClick={handleSave}>
          Сохранить
        </Button>
      </DialogActions>
      <ConfirmModal
        open={confirmModal}
        onConfirm={() => cityId && handleDelete(cityId)}
        onClose={() => setConformModal(false)}
      />
    </Dialog>
  );
}
