import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import CitySelector from '~/entities/City/components/CitySelector';
import { DistrictDto } from '~/entities/District/models/District';
import ConfirmModal from '~/shared/components/dialogs/ConfirmModal';
import ColumnWrapper from '~/shared/ui/ColumnWrapper';

interface Props {
  open: boolean;
  district: DistrictDto | null;
  onSave: (city: DistrictDto) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

export default function DistrictEditDialog({ open, district, onClose, onDelete, onSave }: Props) {
  const [confirmModal, setConformModal] = useState(false);
  const [state, setState] = useState<DistrictDto | null>(null);

  const handleSave = () => {
    state && onSave(state);
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
    if (district) {
      setState(district);
    }
  }, [district]);

  return (
    <Dialog onClose={onClose} open={open} maxWidth='xl'>
      <DialogTitle sx={{ textAlign: 'center' }}>{district ? district.name : ''}</DialogTitle>
      <DialogContent>
        {state ? (
          <ColumnWrapper sx={{ marginTop: 1, minWidth: 'clamp(300px, 20vw, 500px)' }}>
            <TextField
              value={state.name}
              name='name'
              label='Наименование'
              onChange={(e) => setState(() => ({ ...state, name: e.target.value }))}
            />
            <CitySelector
              error={state.cityId == 0}
              currentId={state.cityId}
              onSelect={(id) => setState(() => ({ ...state, cityId: id ? id : 0 }))}
            />
          </ColumnWrapper>
        ) : null}
      </DialogContent>
      <DialogActions>
        {state && state.id && (
          <Button color='error' onClick={() => setConformModal(true)}>
            Удалить
          </Button>
        )}
        <Button onClick={handleCancel}>Отмена</Button>
        <Button disabled={state?.cityId == 0} onClick={handleSave}>
          Сохранить
        </Button>
      </DialogActions>
      <ConfirmModal
        open={confirmModal}
        onConfirm={() => handleDelete(state!.id!)}
        onClose={() => setConformModal(false)}
      />
    </Dialog>
  );
}
