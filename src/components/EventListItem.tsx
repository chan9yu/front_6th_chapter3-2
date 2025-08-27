import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Delete';
import Notifications from '@mui/icons-material/Notifications';
import { Box, IconButton, Stack, Typography } from '@mui/material';

import { notificationOptions } from '../constants/notifications';
import type { Event } from '../types';

type EventListItemProps = {
  event: Event;
  isNotified: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function EventListItem({ event, isNotified, onEdit, onDelete }: EventListItemProps) {
  const notificationLabel = notificationOptions.find(
    (option) => option.value === event.notificationTime
  )?.label;

  return (
    <Box key={event.id} sx={{ border: 1, borderRadius: 2, p: 3, width: '100%' }}>
      <Stack direction="row" justifyContent="space-between">
        <Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            {isNotified && <Notifications color="error" />}
            <Typography
              fontWeight={isNotified ? 'bold' : 'normal'}
              color={isNotified ? 'error' : 'inherit'}
            >
              {event.title}
            </Typography>
          </Stack>
          <Typography>{event.date}</Typography>
          <Typography>
            {event.startTime} - {event.endTime}
          </Typography>
          <Typography>{event.description}</Typography>
          <Typography>{event.location}</Typography>
          <Typography>카테고리: {event.category}</Typography>
          {event.repeat.type !== 'none' && (
            <Typography>
              반복: {event.repeat.interval}
              {event.repeat.type === 'daily' && '일'}
              {event.repeat.type === 'weekly' && '주'}
              {event.repeat.type === 'monthly' && '월'}
              {event.repeat.type === 'yearly' && '년'}
              마다
              {event.repeat.endDate && ` (종료: ${event.repeat.endDate})`}
            </Typography>
          )}
          <Typography>알림:&nbsp;{notificationLabel}</Typography>
        </Stack>
        <Stack>
          <IconButton aria-label="Edit event" onClick={onEdit}>
            <Edit />
          </IconButton>
          <IconButton aria-label="Delete event" onClick={onDelete}>
            <Delete />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}
