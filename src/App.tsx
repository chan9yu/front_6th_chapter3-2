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
  const {
    title,
    setTitle,
    date,
    setDate,
    startTime,
    endTime,
    description,
    setDescription,
    location,
    setLocation,
    category,
    setCategory,
    isRepeating,
    setIsRepeating,
    repeatType,
    // setRepeatType,
    repeatInterval,
    // setRepeatInterval,
    repeatEndDate,
    // setRepeatEndDate,
    notificationTime,
    setNotificationTime,
    startTimeError,
    endTimeError,
    editingEvent,
    setEditingEvent,
    handleStartTimeChange,
    handleEndTimeChange,
    resetForm,
    editEvent,
  } = useEventForm();

  const { events, saveEvent, deleteEvent } = useEventOperations(Boolean(editingEvent), () =>
    setEditingEvent(null)
  );

  const { notifiedEvents } = useNotifications(events);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const addOrUpdateEvent = async () => {
    if (!title || !date || !startTime || !endTime) {
      enqueueSnackbar('필수 정보를 모두 입력해주세요.', { variant: 'error' });
      return;
    }

    if (startTimeError || endTimeError) {
      enqueueSnackbar('시간 설정을 확인해주세요.', { variant: 'error' });
      return;
    }

    const eventData: Event | EventForm = {
      id: editingEvent ? editingEvent.id : undefined,
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      repeat: {
        type: isRepeating ? repeatType : 'none',
        interval: repeatInterval,
        endDate: repeatEndDate || undefined,
      },
      notificationTime,
    };

    const overlapping = findOverlappingEvents(eventData, events);
    if (overlapping.length > 0) {
      setOverlappingEvents(overlapping);
    } else {
      await saveEvent(eventData);
      resetForm();
    }
  };

  const handleOverlapConfirm = () => {
    setOverlappingEvents([]);
    saveEvent({
      id: editingEvent ? editingEvent.id : undefined,
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      repeat: {
        type: isRepeating ? repeatType : 'none',
        interval: repeatInterval,
        endDate: repeatEndDate || undefined,
      },
      notificationTime,
    });
    resetForm();
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', margin: 'auto', p: 5 }}>
      <Stack direction="row" spacing={6} sx={{ height: '100%' }}>
        {/* 일정 추가 & 일정 수정 */}
        <EventEditor
          addOrUpdateEvent={addOrUpdateEvent}
          category={category}
          date={date}
          description={description}
          editingEvent={editingEvent}
          endTime={endTime}
          endTimeError={endTimeError}
          handleEndTimeChange={handleEndTimeChange}
          handleStartTimeChange={handleStartTimeChange}
          isRepeating={isRepeating}
          location={location}
          notificationTime={notificationTime}
          setCategory={setCategory}
          setDate={setDate}
          setDescription={setDescription}
          setIsRepeating={setIsRepeating}
          setLocation={setLocation}
          setNotificationTime={setNotificationTime}
          setTitle={setTitle}
          startTime={startTime}
          startTimeError={startTimeError}
          title={title}
        />
        {/* 일정 보기 */}
        <MainSection
          deleteEvent={deleteEvent}
          editEvent={editEvent}
          events={events}
          notifiedEvents={notifiedEvents}
        />
      </Stack>

      <OverlapDialog onConfirm={handleOverlapConfirm} overlappingEvents={overlappingEvents} />
      <NotificationStack events={events} />
    </Box>
  );
}

export default App;
