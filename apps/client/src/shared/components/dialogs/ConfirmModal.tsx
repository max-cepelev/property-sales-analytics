import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({ open, onClose, onConfirm }: Props) {
  const handleConfirm = () => {
    onConfirm();
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent sx={{ minWidth: 350 }}>
        <Typography textAlign='center'>Подтверждаете удаление?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button color='error' onClick={handleConfirm}>
          Удалить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
