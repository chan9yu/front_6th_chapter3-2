import Close from '@mui/icons-material/Close';
import { Alert, AlertTitle, IconButton, Stack } from '@mui/material';

import { useNotifications } from '../hooks/useNotifications';
import type { Event } from '../types';

type NotificationStackProps = {
  events: Event[];
};

export function NotificationStack({ events }: NotificationStackProps) {
  const { notifications, removeNotification } = useNotifications(events);

  const handleCloseNotification = (index: number) => () => {
    removeNotification(index);
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <Stack position="fixed" top={16} right={16} spacing={2} alignItems="flex-end">
      {notifications.map((notification, index) => (
        <Alert
          key={notification.id}
          severity="info"
          sx={{ width: 'auto' }}
          action={
            <IconButton size="small" onClick={handleCloseNotification(index)}>
              <Close />
            </IconButton>
          }
        >
          <AlertTitle>{notification.message}</AlertTitle>
        </Alert>
      ))}
    </Stack>
  );
}
