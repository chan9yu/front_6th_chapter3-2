import { test, expect, type Page } from '@playwright/test';

test.describe('일정 관리 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: '일정 추가' })).toBeVisible();
  });

  const handleOverlapWarning = async (page: Page) => {
    try {
      const continueButton = page
        .getByRole('button', { name: /계속 진행|계속|continue|확인|yes/i })
        .first();

      if (await continueButton.isVisible({ timeout: 2000 })) {
        await continueButton.click();
        await page.waitForTimeout(500);
      }
    } catch {
      // 팝업이 없으면 무시하고 계속 진행
    }
  };

  test('기본 UI 요소 확인', async ({ page }) => {
    await expect(page.getByLabel('제목')).toBeVisible();
    await expect(page.getByLabel('날짜')).toBeVisible();
    await expect(page.getByLabel('시작 시간')).toBeVisible();
    await expect(page.getByLabel('종료 시간')).toBeVisible();
    await expect(page.getByRole('button', { name: '일정 추가' })).toBeVisible();
  });

  test('폼 입력 기능 확인', async ({ page }) => {
    await page.getByLabel('제목').fill('폼 테스트');
    await page.getByLabel('날짜').fill('2025-10-01');
    await page.getByLabel('시작 시간').fill('14:00');
    await page.getByLabel('종료 시간').fill('15:00');

    await expect(page.getByLabel('제목')).toHaveValue('폼 테스트');
    await expect(page.getByLabel('날짜')).toHaveValue('2025-10-01');
    await expect(page.getByLabel('시작 시간')).toHaveValue('14:00');
    await expect(page.getByLabel('종료 시간')).toHaveValue('15:00');
  });

  test('앱 기본 동작 확인', async ({ page }) => {
    await expect(page).toHaveTitle('일정관리 앱으로 학습하는 테스트 코드');

    await page.getByLabel('제목').fill('동작 테스트');
    await page.getByLabel('날짜').fill('2025-10-01');
    await page.getByLabel('시작 시간').fill('14:30');
    await page.getByLabel('종료 시간').fill('15:30');

    await expect(page.getByRole('button', { name: '일정 추가' })).toBeEnabled();
    await page.getByRole('button', { name: '일정 추가' }).click();

    await handleOverlapWarning(page);

    await page.waitForTimeout(500);
    await expect(page.getByLabel('제목')).toBeVisible();
  });

  test('일정 생성', async ({ page }) => {
    await page.getByLabel('제목').fill('E2E 기본 테스트');
    await page.getByLabel('날짜').fill('2025-10-01');
    await page.getByLabel('시작 시간').fill('14:00');
    await page.getByLabel('종료 시간').fill('15:00');

    await page.getByRole('button', { name: '일정 추가' }).click();

    await handleOverlapWarning(page);
    await page.waitForTimeout(1000);

    await expect(page.getByRole('button', { name: '일정 추가' })).toBeVisible();
    await expect(page.getByLabel('제목')).toHaveValue('');
  });
});
