import { expect, test, type Page } from '@playwright/test';

/** Today's key in the browser's local time, matching what the app renders. */
async function todayKey(page: Page): Promise<string> {
  return page.evaluate(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('region', { name: 'Calendar' })).toBeVisible();
});

test('logs an entry, keeps it across reloads, edits it, and deletes it', async ({ page }) => {
  const today = await todayKey(page);
  await page.goto(`/?date=${today}&selected=${today}`);

  await page.getByRole('button', { name: 'Add Job Search' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Company').fill('Northwind');
  await dialog.getByLabel('Role').fill('Platform Engineer');
  await dialog.getByRole('button', { name: 'Save' }).click();
  await expect(dialog).toBeHidden();

  const row = page.getByText('Northwind · Platform Engineer (Applied)');
  await expect(row).toBeVisible();

  await page.reload();
  await expect(page.getByText('Northwind · Platform Engineer (Applied)')).toBeVisible();

  await page.getByRole('button', { name: /^Edit Northwind/ }).click();
  await page.getByRole('dialog').getByLabel('Status').selectOption('interview');
  await page.getByRole('dialog').getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Northwind · Platform Engineer (Interview)')).toBeVisible();

  await page.getByRole('button', { name: /^Delete Northwind/ }).click();
  await page.getByRole('button', { name: /^Confirm delete Northwind/ }).click();
  await expect(page.getByText('Northwind · Platform Engineer (Interview)')).toBeHidden();
  await expect(page.getByText('Nothing logged yet.')).toBeVisible();
});

test('validates required fields before saving', async ({ page }) => {
  const today = await todayKey(page);
  await page.goto(`/?date=${today}&selected=${today}`);
  await page.getByRole('button', { name: 'Add DSA' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Problem title is required')).toBeVisible();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('habit check-in feeds the dashboard streak', async ({ page }) => {
  const today = await todayKey(page);
  await page.goto(`/?date=${today}&selected=${today}`);

  await page.getByRole('button', { name: 'Add Habit' }).click();
  await page.getByRole('dialog').getByLabel('Name').fill('Exercise');
  await page.getByRole('dialog').getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('region', { name: 'Habits' }).getByLabel('Exercise')).toBeChecked();

  await page.getByRole('link', { name: 'Dashboard' }).click();
  const streaks = page.getByRole('region', { name: 'Habit streaks' });
  await expect(streaks.getByText('Exercise')).toBeVisible();
  await expect(streaks.getByText('done today')).toBeVisible();
  await expect(streaks.getByText('1', { exact: true })).toBeVisible();
});

test('sample data populates every view and can be cleared', async ({ page }) => {
  await page.getByRole('button', { name: 'Load sample data' }).first().click();
  await expect(page.getByText('Nothing tracked yet.')).toBeHidden();

  await page.getByRole('link', { name: 'Search' }).click();
  await expect(page.getByRole('status')).not.toHaveText(/^0 entries/);
  await page.getByLabel('Text').fill('IELTS');
  await expect(page.getByRole('status')).toHaveText(/entries$/);
  await expect(page.getByText('IELTS speaking practice').first()).toBeVisible();

  await page.getByRole('button', { name: 'Clear all data' }).click();
  await page.getByRole('button', { name: 'Confirm clear all data' }).click();
  await expect(page.getByRole('status')).toHaveText('0 entries');
});
