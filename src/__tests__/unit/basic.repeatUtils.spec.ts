import type { Event } from '../../types';
import { createRepeatEvents } from '../../utils/repeatUtils';

describe('repeatUtils', () => {
  describe('createRepeatEvents', () => {
    const baseEvent: Event = {
      id: '1',
      title: '테스트 이벤트',
      date: '2025-01-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '테스트 설명',
      location: '테스트 장소',
      category: '업무',
      repeat: {
        type: 'daily',
        interval: 1,
      },
      notificationTime: 10,
    };

    it('none 타입인 경우 원본 이벤트만 반환한다', () => {
      const event: Event = {
        ...baseEvent,
        repeat: {
          type: 'none',
          interval: 0,
        },
      };

      const result = createRepeatEvents(event);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
      expect(result[0].title).toBe('테스트 이벤트');
      expect(result[0].date).toBe('2025-01-01');
    });

    it('daily 반복으로 endDate까지 이벤트를 생성한다', () => {
      const event: Event = {
        ...baseEvent,
        repeat: {
          type: 'daily',
          interval: 1,
          endDate: '2025-01-03',
        },
      };

      const result = createRepeatEvents(event);

      expect(result).toHaveLength(3);
      expect(result[0].date).toBe('2025-01-01');
      expect(result[1].date).toBe('2025-01-02');
      expect(result[2].date).toBe('2025-01-03');
    });

    it('weekly 반복으로 정확한 간격의 이벤트를 생성한다', () => {
      const event: Event = {
        ...baseEvent,
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-01-15',
        },
      };

      const result = createRepeatEvents(event);

      expect(result).toHaveLength(3);
      expect(result[0].date).toBe('2025-01-01');
      expect(result[1].date).toBe('2025-01-08');
      expect(result[2].date).toBe('2025-01-15');
    });

    it('monthly 반복으로 정확한 간격의 이벤트를 생성한다', () => {
      const event: Event = {
        ...baseEvent,
        repeat: {
          type: 'monthly',
          interval: 1,
          endDate: '2025-03-01',
        },
      };

      const result = createRepeatEvents(event);

      expect(result).toHaveLength(3);
      expect(result[0].date).toBe('2025-01-01');
      expect(result[1].date).toBe('2025-02-01');
      expect(result[2].date).toBe('2025-03-01');
    });

    it('yearly 반복으로 정확한 간격의 이벤트를 생성한다', () => {
      const event: Event = {
        ...baseEvent,
        repeat: {
          type: 'yearly',
          interval: 1,
          endDate: '2027-01-01',
        },
      };
      const result = createRepeatEvents(event);

      expect(result).toHaveLength(3);
      expect(result[0].date).toBe('2025-01-01');
      expect(result[1].date).toBe('2026-01-01');
      expect(result[2].date).toBe('2027-01-01');
    });

    it('interval이 2인 경우 간격을 2배로 적용한다', () => {
      const event: Event = {
        ...baseEvent,
        repeat: {
          type: 'daily',
          interval: 2,
          endDate: '2025-01-05',
        },
      };

      const result = createRepeatEvents(event);

      expect(result).toHaveLength(3);
      expect(result[0].date).toBe('2025-01-01');
      expect(result[1].date).toBe('2025-01-03');
      expect(result[2].date).toBe('2025-01-05');
    });

    it('각 반복 이벤트는 고유한 ID를 가진다', () => {
      const event: Event = {
        ...baseEvent,
        repeat: {
          type: 'daily',
          interval: 1,
        },
      };

      const result = createRepeatEvents(event);

      const ids = result.map((e) => e.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });

    it('원본 이벤트의 모든 속성이 복사된다', () => {
      const event: Event = {
        ...baseEvent,
        repeat: {
          type: 'daily',
          interval: 1,
        },
      };

      const result = createRepeatEvents(event);

      result.forEach((repeatEvent) => {
        expect(repeatEvent.title).toBe('테스트 이벤트');
        expect(repeatEvent.startTime).toBe('10:00');
        expect(repeatEvent.endTime).toBe('11:00');
        expect(repeatEvent.description).toBe('테스트 설명');
        expect(repeatEvent.location).toBe('테스트 장소');
        expect(repeatEvent.category).toBe('업무');
        expect(repeatEvent.notificationTime).toBe(10);
      });
    });

    it('endDate가 설정된 경우 해당 날짜까지만 이벤트를 생성한다', () => {
      const event: Event = {
        ...baseEvent,
        repeat: {
          type: 'daily',
          interval: 1,
          endDate: '2025-01-03',
        },
      };

      const result = createRepeatEvents(event);

      expect(result).toHaveLength(3);
      expect(result[result.length - 1].date).toBe('2025-01-03');
    });

    it('endDate가 시작일보다 이전인 경우 원본 이벤트만 반환한다', () => {
      const event: Event = {
        ...baseEvent,
        repeat: {
          type: 'daily',
          interval: 1,
          endDate: '2024-12-31',
        },
      };

      const result = createRepeatEvents(event);

      expect(result).toHaveLength(1);
      expect(result[0].date).toBe('2025-01-01');
    });

    it('최대 날짜 제한 - 2025-10-30까지만 생성한다', () => {
      const event: Event = {
        ...baseEvent,
        repeat: {
          type: 'daily',
          interval: 1,
        },
      };

      const result = createRepeatEvents(event);
      const lastEvent = result[result.length - 1];

      expect(result.length).toBeGreaterThan(1);
      expect(new Date(lastEvent.date) <= new Date('2025-10-30')).toBe(true);
    });

    it('월말 날짜에서 monthly 반복 시 말일 처리를 올바르게 한다', () => {
      const event: Event = {
        ...baseEvent,
        date: '2025-01-31',
        repeat: {
          type: 'monthly',
          interval: 1,
          endDate: '2025-03-31',
        },
      };
      const result = createRepeatEvents(event);

      expect(result).toHaveLength(3);
      expect(result[0].date).toBe('2025-01-31');
      expect(result[1].date).toBe('2025-02-28'); // 2월은 28일까지
      expect(result[2].date).toBe('2025-03-31');
    });

    it('윤년 처리를 올바르게 한다', () => {
      const event: Event = {
        ...baseEvent,
        date: '2024-02-29',
        repeat: {
          type: 'yearly',
          interval: 1,
          endDate: '2026-02-28',
        },
      };
      const result = createRepeatEvents(event);

      expect(result).toHaveLength(3);
      expect(result[0].date).toBe('2024-02-29');
      expect(result[1].date).toBe('2025-02-28');
      expect(result[2].date).toBe('2026-02-28');
    });
  });
});
