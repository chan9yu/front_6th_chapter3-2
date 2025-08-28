import type { Event } from '../types';
import { formatDate } from './dateUtils';

class RepeatHelper {
  private static readonly DEFAULT_END_DATE = '2025-10-30';

  public createRepeatEvents(event: Event): Event[] {
    if (event.repeat.type === 'none') {
      return [event];
    }

    const startDate = new Date(event.date);
    const endDate = event.repeat.endDate
      ? new Date(event.repeat.endDate)
      : new Date(RepeatHelper.DEFAULT_END_DATE);

    if (endDate < startDate) {
      return [event];
    }

    const events: Event[] = [{ ...event, isRecurring: true }];
    const originalDay = startDate.getDate();

    let currentDate = new Date(startDate);
    let eventCount = 1;

    const collectNext = (date: Date) => {
      const nextDate = this.getNextDate(date, event.repeat, originalDay);

      if (nextDate > endDate) return;

      events.push({
        ...event,
        id: `${event.id}-${eventCount}`,
        date: formatDate(nextDate),
        originalId: event.id,
        isRecurring: true,
      });

      eventCount = eventCount + 1;
      collectNext(nextDate);
    };

    collectNext(currentDate);

    return events;
  }

  private getNextDate(currentDate: Date, repeat: Event['repeat'], originalDay: number): Date {
    switch (repeat.type) {
      case 'daily':
        return this.addDays(currentDate, repeat.interval);
      case 'weekly':
        return this.addDays(currentDate, 7 * repeat.interval);
      case 'monthly':
        return this.addMonths(currentDate, repeat.interval, originalDay);
      case 'yearly':
        return this.addYears(currentDate, repeat.interval, originalDay);
      default:
        return currentDate;
    }
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);

    return result;
  }

  private addMonths(date: Date, months: number, originalDay: number): Date {
    const result = new Date(date);
    const newYear = result.getFullYear();
    const newMonth = result.getMonth() + months;

    const lastDayOfTargetMonth = new Date(newYear, newMonth + 1, 0).getDate();
    const targetDay = Math.min(originalDay, lastDayOfTargetMonth);
    result.setFullYear(newYear, newMonth, targetDay);

    return result;
  }

  private addYears(date: Date, years: number, originalDay: number): Date {
    const result = new Date(date);
    const originalMonth = result.getMonth();

    result.setFullYear(result.getFullYear() + years);
    result.setMonth(originalMonth);

    if (originalMonth === 1 && originalDay === 29) {
      const isLeapYear = this.isLeapYear(result.getFullYear());
      result.setDate(isLeapYear ? 29 : 28);
    } else {
      result.setDate(originalDay);
    }

    return result;
  }

  private isLeapYear(year: number) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  }
}

export const repeatHelper = new RepeatHelper();
