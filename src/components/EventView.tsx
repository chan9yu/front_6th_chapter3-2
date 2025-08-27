import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { IconButton, MenuItem, Select, Stack, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { Dispatch, SetStateAction } from 'react';

import type { Event } from '../types';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';

type EventViewProps = {
  currentDate: Date;
  filteredEvents: Event[];
  holidays: { [key: string]: string };
  navigate: (direction: 'next' | 'prev') => void;
  notifiedEvents: string[];
  setView: Dispatch<SetStateAction<'week' | 'month'>>;
  view: 'week' | 'month';
};

export function EventView({
  currentDate,
  filteredEvents,
  holidays,
  navigate,
  notifiedEvents,
  setView,
  view,
}: EventViewProps) {
  const handlePrevious = () => {
    navigate('prev');
  };

  const handleNext = () => {
    navigate('next');
  };

  const handleViewChange = (event: SelectChangeEvent<'week' | 'month'>) => {
    setView(event.target.value);
  };

  return (
    <Stack flex={1} spacing={5}>
      <Typography variant="h4">일정 보기</Typography>

      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
        <IconButton aria-label="Previous" onClick={handlePrevious}>
          <ChevronLeft />
        </IconButton>
        <Select size="small" aria-label="뷰 타입 선택" value={view} onChange={handleViewChange}>
          <MenuItem value="week" aria-label="week-option">
            Week
          </MenuItem>
          <MenuItem value="month" aria-label="month-option">
            Month
          </MenuItem>
        </Select>
        <IconButton aria-label="Next" onClick={handleNext}>
          <ChevronRight />
        </IconButton>
      </Stack>

      {view === 'week' && (
        <WeekView
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
        />
      )}

      {view === 'month' && (
        <MonthView
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          holidays={holidays}
          notifiedEvents={notifiedEvents}
        />
      )}
    </Stack>
  );
}
