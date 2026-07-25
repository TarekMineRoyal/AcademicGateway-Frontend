import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';

// Clear localStorage between test runs
beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});