import fs from 'node:fs';
import process from 'node:process';
import { chromium } from '@playwright/test';

const executablePath = chromium.executablePath();

if (!executablePath || !fs.existsSync(executablePath)) {
  console.error('\n[playwright-check] Chromium browser binary is missing.');
  console.error(`[playwright-check] Expected executable: ${executablePath || '(not resolved)'}`);
  console.error('[playwright-check] Install it with one of:');
  console.error('  npx playwright install chromium');
  console.error('  npx playwright install --with-deps chromium   # Linux/CI');
  process.exit(1);
}
