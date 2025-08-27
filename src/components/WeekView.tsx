import { Stack, Table, TableBody, TableContainer, TableRow, Typography } from '@mui/material';

import type { Event } from '../types';
import { CalendarHeader } from './CalendarHeader';
import { DayCell } from './DayCell';
import { formatWeek, getWeekDates } from '../utils/dateUtils';

type WeekViewProps = {
  currentDate: Date;
  filteredEvents: Event[];
  notifiedEvents: string[];
};

export function WeekView({ currentDate, filteredEvents, notifiedEvents }: WeekViewProps) {
  const weekDates = getWeekDates(currentDate);

  return (
    <Stack data-testid="week-view" spacing={4} sx={{ width: '100%' }}>
      <Typography variant="h5">{formatWeek(currentDate)}</Typography>
      <TableContainer>
        <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
          <CalendarHeader />
          <TableBody>
            <TableRow>
              {weekDates.map((date, index) => (
                <DayCell
                  key={index}
                  dayNumber={date.getDate()}
                  dayEvents={filteredEvents.filter(
                    (event) => new Date(event.date).toDateString() === date.toDateString()
                  )}
                  notifiedEvents={notifiedEvents}
                />
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
