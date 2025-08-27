import { Stack, Table, TableBody, TableContainer, TableRow, Typography } from '@mui/material';

import type { Event } from '../types';
import { CalendarHeader } from './CalendarHeader';
import { DayCell } from './DayCell';
import { formatDate, formatMonth, getWeeksAtMonth, getEventsForDay } from '../utils/dateUtils';

type MonthViewProps = {
  currentDate: Date;
  filteredEvents: Event[];
  holidays: { [key: string]: string };
  notifiedEvents: string[];
};

export function MonthView({
  currentDate,
  filteredEvents,
  holidays,
  notifiedEvents,
}: MonthViewProps) {
  const weeks = getWeeksAtMonth(currentDate);

  return (
    <Stack data-testid="month-view" spacing={4} sx={{ width: '100%' }}>
      <Typography variant="h5">{formatMonth(currentDate)}</Typography>
      <TableContainer>
        <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
          <CalendarHeader />
          <TableBody>
            {weeks.map((week, weekIndex) => (
              <TableRow key={weekIndex}>
                {week.map((day, dayIndex) => (
                  <DayCell
                    key={dayIndex}
                    dayNumber={day}
                    dayEvents={day ? getEventsForDay(filteredEvents, day) : []}
                    notifiedEvents={notifiedEvents}
                    holiday={holidays[day ? formatDate(currentDate, day) : '']}
                  />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
