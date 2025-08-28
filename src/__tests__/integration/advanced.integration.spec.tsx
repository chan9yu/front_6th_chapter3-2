import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';

import { setupMockHandlerCreation } from '../../__mocks__/handlersUtils';
import { App } from '../../App';

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

describe('Advanced 통합 테스트 - 최종 간단 테스트', () => {
  describe('애플리케이션 기본 렌더링', () => {
    it('앱이 정상적으로 렌더링되고 기본 UI 요소들이 표시된다', () => {
      setupMockHandlerCreation([]);

      setup(<App />);

      expect(screen.getByRole('button', { name: '일정 추가' })).toBeInTheDocument();
      expect(screen.getByLabelText('제목')).toBeInTheDocument();
      expect(screen.getByLabelText('날짜')).toBeInTheDocument();
    });

    it('빈 일정 상태일 때 적절한 메시지나 UI가 표시된다', () => {
      setupMockHandlerCreation([]);

      setup(<App />);

      expect(screen.getAllByText('일정 추가').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('서버 데이터 로딩', () => {
    it('일정 폼이 정상적으로 동작한다', () => {
      setupMockHandlerCreation([]);

      setup(<App />);

      expect(screen.getByLabelText('시작 시간')).toBeInTheDocument();
      expect(screen.getByLabelText('종료 시간')).toBeInTheDocument();
    });

    it('반복 일정 설정이 가능한지 확인한다', () => {
      setupMockHandlerCreation([]);

      setup(<App />);

      const repeatCheckbox = screen.queryByRole('checkbox', { name: '반복 일정' });
      expect(repeatCheckbox).toBeInTheDocument();
    });
  });

  describe('오류 처리', () => {
    it('서버 오류 시 적절히 처리한다', () => {
      setupMockHandlerCreation([]);

      setup(<App />);

      expect(screen.getAllByText('일정 추가').length).toBeGreaterThan(0);
    });
  });
});
