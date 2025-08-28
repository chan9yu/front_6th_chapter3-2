import { http, HttpResponse } from 'msw';

import { server } from '../setupTests';
import { Event } from '../types';

// ! Hard 여기 제공 안함
export const setupMockHandlerCreation = (initEvents = [] as Event[]) => {
  const mockEvents: Event[] = [...initEvents];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.post('/api/events', async ({ request }) => {
      const newEvent = (await request.json()) as Event;
      newEvent.id = String(mockEvents.length + 1); // 간단한 ID 생성
      mockEvents.push(newEvent);
      return HttpResponse.json(newEvent, { status: 201 });
    })
  );
};

export const setupMockHandlerUpdating = () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '기존 회의',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '기존 회의2',
      date: '2025-10-15',
      startTime: '11:00',
      endTime: '12:00',
      description: '기존 팀 미팅 2',
      location: '회의실 C',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.put('/api/events/:id', async ({ params, request }) => {
      const { id } = params;
      const updatedEvent = (await request.json()) as Event;
      const index = mockEvents.findIndex((event) => event.id === id);

      mockEvents[index] = { ...mockEvents[index], ...updatedEvent };
      return HttpResponse.json(mockEvents[index]);
    })
  );
};

export const setupMockHandlerDeletion = () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '삭제할 이벤트',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '삭제할 이벤트입니다',
      location: '어딘가',
      category: '기타',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.delete('/api/events/:id', ({ params }) => {
      const { id } = params;
      const index = mockEvents.findIndex((event) => event.id === id);

      mockEvents.splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    })
  );
};

export const setupMockHandlerCreationRepeat = (initEvents = [] as Event[]) => {
  const mockEvents: Event[] = [...initEvents];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.post('/api/events-list', async ({ request }) => {
      const { events } = (await request.json()) as { events: Event[] };
      events.forEach((event, index) => {
        event.id = String(mockEvents.length + index + 1); // 간단한 ID 생성
      });
      mockEvents.push(...events);
      return HttpResponse.json(events, { status: 201 });
    }),
    http.put('/api/events/:id', async ({ params, request }) => {
      const id = params.id as string;
      const updatedEvent = (await request.json()) as Event;
      const eventIndex = mockEvents.findIndex((event) => event.id === id);

      if (eventIndex > -1) {
        mockEvents[eventIndex] = { ...mockEvents[eventIndex], ...updatedEvent };
        return HttpResponse.json(mockEvents[eventIndex]);
      }

      return HttpResponse.json({ error: 'Event not found' }, { status: 404 });
    }),
    http.delete('/api/events/:id', ({ params }) => {
      const id = params.id as string;
      const eventIndex = mockEvents.findIndex((event) => event.id === id);

      if (eventIndex > -1) {
        mockEvents.splice(eventIndex, 1);
        return new HttpResponse(null, { status: 204 });
      }

      return HttpResponse.json({ error: 'Event not found' }, { status: 404 });
    })
  );
};

export const setupMockHandlerMonthlyRepeat = () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '31일 매월 반복',
      date: '2025-01-31',
      startTime: '14:00',
      endTime: '15:00',
      description: '31일 매월 테스트',
      location: '테스트 장소',
      category: '업무',
      repeat: { type: 'monthly', interval: 1, endDate: '2025-04-30' },
      notificationTime: 10,
      isRecurring: true,
    },
    {
      id: '2',
      title: '31일 매월 반복',
      date: '2025-02-28',
      startTime: '14:00',
      endTime: '15:00',
      description: '31일 매월 테스트',
      location: '테스트 장소',
      category: '업무',
      repeat: { type: 'monthly', interval: 1, endDate: '2025-04-30' },
      notificationTime: 10,
      originalId: '1',
      isRecurring: true,
    },
    {
      id: '3',
      title: '31일 매월 반복',
      date: '2025-03-31',
      startTime: '14:00',
      endTime: '15:00',
      description: '31일 매월 테스트',
      location: '테스트 장소',
      category: '업무',
      repeat: { type: 'monthly', interval: 1, endDate: '2025-04-30' },
      notificationTime: 10,
      originalId: '1',
      isRecurring: true,
    },
  ];

  server.use(
    http.post('/api/events-list', async () => {
      return HttpResponse.json(mockEvents);
    })
  );
};

export const setupMockHandlerYearlyRepeat = () => {
  const mockEvents: Event[] = [
    {
      id: '4',
      title: '윤년 29일 매년 반복',
      date: '2024-02-29',
      startTime: '09:00',
      endTime: '10:00',
      description: '윤년 테스트',
      location: '테스트 장소',
      category: '개인',
      repeat: { type: 'yearly', interval: 1, endDate: '2027-02-28' },
      notificationTime: 5,
      isRecurring: true,
    },
    {
      id: '5',
      title: '윤년 29일 매년 반복',
      date: '2025-02-28',
      startTime: '09:00',
      endTime: '10:00',
      description: '윤년 테스트',
      location: '테스트 장소',
      category: '개인',
      repeat: { type: 'yearly', interval: 1, endDate: '2027-02-28' },
      notificationTime: 5,
      originalId: '4',
      isRecurring: true,
    },
    {
      id: '6',
      title: '윤년 29일 매년 반복',
      date: '2026-02-28',
      startTime: '09:00',
      endTime: '10:00',
      description: '윤년 테스트',
      location: '테스트 장소',
      category: '개인',
      repeat: { type: 'yearly', interval: 1, endDate: '2027-02-28' },
      notificationTime: 5,
      originalId: '4',
      isRecurring: true,
    },
  ];

  server.use(
    http.post('/api/events-list', async () => {
      return HttpResponse.json(mockEvents);
    })
  );
};
