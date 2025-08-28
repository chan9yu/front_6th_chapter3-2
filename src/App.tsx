import { Box, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import { EventEditor } from './components/EventEditor';
import { MainSection } from './components/MainSection';
import { NotificationStack } from './components/NotificationStack';
import { OverlapDialog } from './components/OverlapDialog';
import { useEventForm } from './hooks/useEventForm';
import { useEventOperations } from './hooks/useEventOperations';
import { useNotifications } from './hooks/useNotifications';
import type { Event, EventForm } from './types';
import { findOverlappingEvents } from './utils/eventOverlap';

export function App() {
  const eventFormData = useEventForm();

  const { events, saveEvent, deleteEvent } = useEventOperations(
    Boolean(eventFormData.editingEvent),
    () => eventFormData.setEditingEvent(null)
  );

  const { notifiedEvents } = useNotifications(events);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const createEventData = (): Event | EventForm => ({
    id: eventFormData.editingEvent ? eventFormData.editingEvent.id : undefined,
    title: eventFormData.title,
    date: eventFormData.date,
    startTime: eventFormData.startTime,
    endTime: eventFormData.endTime,
    description: eventFormData.description,
    location: eventFormData.location,
    category: eventFormData.category,
    repeat: {
      type: eventFormData.isRepeating ? eventFormData.repeatType : 'none',
      interval: eventFormData.repeatInterval,
      endDate: eventFormData.repeatEndDate || undefined,
    },
    notificationTime: eventFormData.notificationTime,
  });

  const addOrUpdateEvent = async () => {
    if (
      !eventFormData.title ||
      !eventFormData.date ||
      !eventFormData.startTime ||
      !eventFormData.endTime
    ) {
      enqueueSnackbar('필수 정보를 모두 입력해주세요.', { variant: 'error' });
      return;
    }

    if (eventFormData.startTimeError || eventFormData.endTimeError) {
      enqueueSnackbar('시간 설정을 확인해주세요.', { variant: 'error' });
      return;
    }

    const eventData = createEventData();
    const overlapping = findOverlappingEvents(eventData, events);

    if (overlapping.length > 0) {
      setOverlappingEvents(overlapping);
    } else {
      await saveEvent(eventData);
      eventFormData.resetForm();
    }
  };

  const handleOverlapConfirm = () => {
    setOverlappingEvents([]);
    saveEvent(createEventData());
    eventFormData.resetForm();
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', margin: 'auto', p: 5 }}>
      <Stack direction="row" spacing={6} sx={{ height: '100%' }}>
        {/* 일정 추가 & 일정 수정 */}
        <EventEditor addOrUpdateEvent={addOrUpdateEvent} {...eventFormData} />
        {/* 일정 보기 */}
        <MainSection
          deleteEvent={deleteEvent}
          editEvent={eventFormData.editEvent}
          events={events}
          notifiedEvents={notifiedEvents}
        />
      </Stack>

      <OverlapDialog onConfirm={handleOverlapConfirm} overlappingEvents={overlappingEvents} />
      <NotificationStack events={events} />
    </Box>
  );
}
