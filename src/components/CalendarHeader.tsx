import { TableCell, TableHead, TableRow } from '@mui/material';

import { weekDays } from '../constants/calendar';

export function CalendarHeader() {
  return (
    <TableHead>
      <TableRow>
        {weekDays.map((day, index) => (
          <TableCell key={index} sx={{ width: '14.28%', padding: 1, textAlign: 'center' }}>
            {day}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
