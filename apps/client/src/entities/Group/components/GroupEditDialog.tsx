import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import ConfirmModal from '~/shared/components/dialogs/ConfirmModal';
import ColumnWrapper from '~/shared/ui/ColumnWrapper';

interface Props {
  open: boolean;
  group: { name: string; id?: number } | null;
  onSave: ({ name, id }: { name: string; id?: number }) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

export default function GroupEditDialog({ open, group, onClose, onDelete, onSave }: Props) {
  const [state, setState] = useState<{ name: string; id?: number } | null>(null);
  const [confirmModal, setConformModal] = useState(false);

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
    if (group) {
      setState(group);
    }
  }, [group]);

  return (
    <Dialog onClose={onClose} open={open} maxWidth='xl'>
      <DialogTitle sx={{ textAlign: 'center' }}>{group ? group.name : ''}</DialogTitle>
      <DialogContent>
        {state ? (
          <ColumnWrapper sx={{ marginTop: 1, minWidth: 'clamp(300px, 20vw, 500px)' }}>
            <TextField
              value={state.name}
              name='name'
              label='Наименование'
              onChange={(e) => setState(() => ({ ...state, name: e.target.value }))}
            />
          </ColumnWrapper>
        ) : null}
      </DialogContent>
      <DialogActions>
        {state?.id && (
          <Button color='error' onClick={() => setConformModal(true)}>
            Удалить
          </Button>
        )}
        <Button onClick={handleCancel}>Отмена</Button>
        <Button onClick={handleSave}>Сохранить</Button>
      </DialogActions>
      <ConfirmModal
        open={confirmModal}
        onConfirm={() => handleDelete(state!.id!)}
        onClose={() => setConformModal(false)}
      />
    </Dialog>
  );
}
