import { TableCell, Typography } from '@mui/material';

import type { Event } from '../types';
import { EventItem } from './EventItem';

type DayCellProps = {
  dayNumber: number | null;
  dayEvents: Event[];
  notifiedEvents: string[];
  holiday?: string;
};

export function DayCell({ dayNumber, dayEvents, notifiedEvents, holiday }: DayCellProps) {
  return (
    <TableCell
      sx={{
        height: '120px',
        verticalAlign: 'top',
        width: '14.28%',
        padding: 1,
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {dayNumber && (
        <>
          <Typography variant="body2" fontWeight="bold">
            {dayNumber}
          </Typography>
          {holiday && (
            <Typography variant="body2" color="error">
              {holiday}
            </Typography>
          )}
          {dayEvents.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              isNotified={notifiedEvents.includes(event.id)}
            />
          ))}
        </>
      )}
    </TableCell>
  );
}
