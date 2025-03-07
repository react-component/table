import { act } from '@testing-library/react';

export function safeAct() {
  return act(async () => {
    vi.runAllTimers();
    await Promise.resolve();
  });
}
