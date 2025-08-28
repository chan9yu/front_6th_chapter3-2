import { describe, it, expect } from 'vitest';

import type { Event } from '../../types';
import { repeatHelper } from '../../utils/repeatUtils';

describe('핵심 반복 일정 로직 테스트', () => {
  const baseEvent: Event = {
    id: '1',
    title: '회의',
    date: '2024-10-15',
    startTime: '10:00',
    endTime: '11:00',
    description: '',
    location: '',
    category: '',
    repeat: {
      type: 'none',
      interval: 1,
      endDate: '',
    },
    notificationTime: 10,
  };

  describe('핵심 날짜 조정 로직', () => {
    it('윤년 2월 29일 매년 반복 시 평년에는 2월 28일로 조정', () => {
      const leapYearEvent: Event = {
        ...baseEvent,
        date: '2024-02-29',
        repeat: {
          type: 'yearly',
          interval: 1,
          endDate: '2026-03-01',
        },
      };

      const result = repeatHelper.createRepeatEvents(leapYearEvent);

      expect(result[0].date).toBe('2024-02-29');
      expect(result[1].date).toBe('2025-02-28');
      expect(result[2].date).toBe('2026-02-28');
    });

    it('매월 31일 반복 시 짧은 달에서 마지막 날로 조정', () => {
      const monthlyEvent: Event = {
        ...baseEvent,
        date: '2024-10-31',
        repeat: {
          type: 'monthly',
          interval: 1,
          endDate: '2025-02-28',
        },
      };

      const result = repeatHelper.createRepeatEvents(monthlyEvent);

      expect(result[0].date).toBe('2024-10-31');
      expect(result[1].date).toBe('2024-11-30');
      expect(result[4].date).toBe('2025-02-28');
    });
  });

  describe('필수 메타데이터', () => {
    it('반복 이벤트는 isRecurring과 올바른 ID 생성', () => {
      const repeatEvent: Event = {
        ...baseEvent,
        id: '2',
        repeat: {
          type: 'daily',
          interval: 1,
          endDate: '2024-10-18',
        },
      };

      const result = repeatHelper.createRepeatEvents(repeatEvent);
      result.forEach((event) => expect(event.isRecurring).toBe(true));

      expect(result[0].id).toBe('2');
      expect(result[1].id).toBe('2-1');
    });
  });

  describe('경계값', () => {
    it('none 타입은 원본만 반환', () => {
      const result = repeatHelper.createRepeatEvents(baseEvent);
      expect(result).toHaveLength(1);
    });

    it('종료날짜 없으면 기본값(2025-10-30) 사용', () => {
      const noEndEvent: Event = {
        ...baseEvent,
        date: '2025-10-28',
        repeat: {
          type: 'daily',
          interval: 1,
          endDate: '',
        },
      };

      const result = repeatHelper.createRepeatEvents(noEndEvent);
      expect(result[result.length - 1].date).toBe('2025-10-30');
    });
  });
});
