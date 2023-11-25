import { act } from 'react-dom/test-utils';

export function safeAct(wrapper, cb) {
  return act(async () => {
    cb && cb();
    vi.runAllTimers();
    await Promise.resolve();
    wrapper.update();
  });
}
