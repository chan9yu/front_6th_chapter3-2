import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';

import {
  setupMockHandlerCreation,
  setupMockHandlerMonthlyRepeat,
  setupMockHandlerYearlyRepeat,
} from '../__mocks__/handlersUtils';
import { App } from '../App';
import type { Event, RepeatType } from '../types';

const setup = (element: ReactElement) => {
  const theme = createTheme();
  const user = userEvent.setup();

  return {
    ...render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>{element}</SnackbarProvider>
      </ThemeProvider>
    ),
    user,
  };
};

const saveRepeatSchedule = async (
  user: UserEvent,
  form: Pick<Event, 'title' | 'date' | 'startTime' | 'endTime' | 'repeat'>
) => {
  const { title, date, startTime, endTime, repeat } = form;

  const titleInput = screen.getByLabelText('제목');
  await user.type(titleInput, title);

  const dateInput = screen.getByLabelText('날짜');
  await user.clear(dateInput);
  await user.type(dateInput, date);

  const startTimeInput = screen.getByLabelText('시작 시간');
  await user.clear(startTimeInput);
  await user.type(startTimeInput, startTime);

  const endTimeInput = screen.getByLabelText('종료 시간');
  await user.clear(endTimeInput);
  await user.type(endTimeInput, endTime);

  const repeatCheckbox = screen.getByRole('checkbox', { name: '반복 일정' });
  await user.click(repeatCheckbox);

  const repeatTypeLabel = await screen.findByText('반복 유형');
  expect(repeatTypeLabel).toBeInTheDocument();

  const repeatTypeSelects = screen.getAllByRole('combobox');
  const repeatTypeSelect = repeatTypeSelects.find(
    (select) => !select.id || (select.id !== 'category' && select.id !== 'notification')
  );
  await user.click(repeatTypeSelect!);

  const typeMap: Record<RepeatType, string> = {
    none: '반복 안함',
    daily: '매일',
    weekly: '매주',
    monthly: '매월',
    yearly: '매년',
  };
  await user.click(screen.getByText(typeMap[repeat.type]));

  if (repeat.endDate) {
    const endDateInput = screen.getByLabelText('반복 종료일');
    await user.type(endDateInput, repeat.endDate);
  }

  const submitButton = screen.getByRole('button', { name: '일정 추가' });
  await user.click(submitButton);

  const titleInputAfterSubmit = screen.getByLabelText('제목');
  expect(titleInputAfterSubmit).toHaveValue('');
};

describe('반복 일정 기능', () => {
  it('반복 유형을 선택하여 일정을 생성할 수 있다.', async () => {
    const { user } = setup(<App />);

    await saveRepeatSchedule(user, {
      title: '반복 테스트 일정',
      date: '2025-10-15',
      startTime: '10:00',
      endTime: '11:00',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2025-12-15',
      },
    });

    expect(screen.queryByDisplayValue('반복 테스트 일정')).not.toBeInTheDocument();
  });

  describe('특별한 날짜의 반복 일정 처리', () => {
    it('31일 매월 반복 시 해당 일자에만 일정이 생성된다.', async () => {
      setupMockHandlerMonthlyRepeat();

      const { user } = setup(<App />);

      await saveRepeatSchedule(user, {
        title: '31일 매월 반복',
        date: '2025-10-31',
        startTime: '14:00',
        endTime: '15:00',
        repeat: {
          type: 'monthly',
          interval: 1,
          endDate: '2025-12-30',
        },
      });

      expect(screen.queryByDisplayValue('31일 매월 반복')).not.toBeInTheDocument();
    });

    it('윤년 2월 29일 매년 반복 시 해당 일자에만 일정이 생성된다.', async () => {
      setupMockHandlerYearlyRepeat();

      const { user } = setup(<App />);

      await saveRepeatSchedule(user, {
        title: '윤년 29일 매년 반복',
        date: '2024-10-29',
        startTime: '09:00',
        endTime: '10:00',
        repeat: {
          type: 'yearly',
          interval: 1,
          endDate: '2027-10-28',
        },
      });

      expect(screen.queryByDisplayValue('윤년 29일 매년 반복')).not.toBeInTheDocument();
    });
  });
});

describe('반복 일정 표시', () => {
  it('캘린더 뷰에서 반복 일정을 아이콘을 넣어 구분하여 표시한다.', async () => {
    setupMockHandlerCreation();

    const { user } = setup(<App />);

    await saveRepeatSchedule(user, {
      title: '반복 아이콘 테스트',
      date: '2025-10-01',
      startTime: '10:00',
      endTime: '11:00',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2025-12-31',
      },
    });

    expect(screen.queryByDisplayValue('반복 아이콘 테스트')).not.toBeInTheDocument();

    const eventTitles = await screen.findAllByText('반복 아이콘 테스트');
    expect(eventTitles.length).toBeGreaterThan(0);

    const repeatIcons = screen.getAllByTestId('repeat-icon');
    expect(repeatIcons.length).toBeGreaterThan(0);
    expect(repeatIcons[0]).toBeInTheDocument();
  });
});
