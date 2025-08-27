import { FormControl, FormLabel, Stack, TextField, Typography } from '@mui/material';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';

import type { Event } from '../types';
import { EventListItem } from './EventListItem';

type EventListProps = {
  filteredEvents: Event[];
  notifiedEvents: string[];
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  editEvent: (event: Event) => void;
  deleteEvent: (id: string) => Promise<void>;
};

export function EventList({
  deleteEvent,
  editEvent,
  filteredEvents,
  notifiedEvents,
  searchTerm,
  setSearchTerm,
}: EventListProps) {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleEditEvent = (event: Event) => () => {
    editEvent(event);
  };

  const handleDeleteEvent = (eventId: string) => () => {
    deleteEvent(eventId);
  };

  return (
    <Stack
      data-testid="event-list"
      spacing={2}
      sx={{ width: '30%', height: '100%', overflowY: 'auto' }}
    >
      <FormControl fullWidth>
        <FormLabel htmlFor="search">일정 검색</FormLabel>
        <TextField
          id="search"
          size="small"
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </FormControl>

      {filteredEvents.length === 0 ? (
        <Typography>검색 결과가 없습니다.</Typography>
      ) : (
        filteredEvents.map((event) => (
          <EventListItem
            key={event.id}
            event={event}
            isNotified={notifiedEvents.includes(event.id)}
            onEdit={handleEditEvent(event)}
            onDelete={handleDeleteEvent(event.id)}
          />
        ))
      )}
    </Stack>
  );
}
