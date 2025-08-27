import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import type { Event } from '../types';

type OverlapDialogProps = {
  onConfirm: () => void;
  overlappingEvents: Event[] | null;
};

export function OverlapDialog({ onConfirm, overlappingEvents }: OverlapDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (overlappingEvents && overlappingEvents.length > 0) {
      setOpen(true);
    }
  }, [overlappingEvents]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(false);
    onConfirm();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>일정 겹침 경고</DialogTitle>
      <DialogContent>
        <DialogContentText>
          다음 일정과 겹칩니다:
          {overlappingEvents?.map((event) => (
            <Typography key={event.id}>
              {event.title} ({event.date} {event.startTime}-{event.endTime})
            </Typography>
          ))}
          계속 진행하시겠습니까?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button color="error" onClick={handleConfirm}>
          계속 진행
        </Button>
      </DialogActions>
    </Dialog>
  );
}
