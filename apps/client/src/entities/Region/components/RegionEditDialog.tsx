import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '~/shared/lib/MUI';
import { useEffect, useState } from 'react';
import { Region } from '~/shared/models/gql/graphql';
import ColumnWrapper from '~/shared/ui/ColumnWrapper';
import ConfirmModal from '~/shared/components/dialogs/ConfirmModal';

interface Props {
  open: boolean;
  region: Region | null;
  onSave: (region: Region) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

export default function RegionEditDialog({ open, region, onClose, onDelete, onSave }: Props) {
  const [state, setState] = useState<Region | null>(null);
  const [confirmModal, setConformModal] = useState(false);

  const handleSave = () => {
    state && onSave(state);
    setState(null);
    onClose();
  };

  const handleDelete = (id: number) => {
    onDelete(+id);
    setState(null);
    setConformModal(false);
    onClose();
  };

  const handleCancel = () => {
    setState(null);
    onClose();
  };

  useEffect(() => {
    if (region) {
      setState(region);
    }
  }, [region]);

  return (
    <Dialog onClose={onClose} open={open} maxWidth='xl'>
      <DialogTitle sx={{ textAlign: 'center' }}>{region ? region.name : ''}</DialogTitle>
      <DialogContent>
        <ColumnWrapper sx={{ marginTop: 1, minWidth: 'clamp(300px, 20vw, 500px)' }}>
          <TextField
            value={state?.name || ''}
            name='name'
            label='Наименование'
            placeholder='Новый регион'
            onChange={(e) => state && setState(() => ({ ...state, name: e.target.value }))}
          />
        </ColumnWrapper>
      </DialogContent>
      <DialogActions>
        {state?.id ? (
          <Button color='error' onClick={() => setConformModal(true)}>
            Удалить
          </Button>
        ) : null}
        <Button onClick={handleCancel}>Отмена</Button>
        <Button onClick={handleSave}>Сохранить</Button>
      </DialogActions>
      <ConfirmModal
        open={confirmModal}
        onConfirm={() => state?.id && handleDelete(state.id)}
        onClose={() => setConformModal(false)}
      />
    </Dialog>
  );
}
