import { act } from 'react-dom/test-utils';

export function safeAct(wrapper, cb) {
  return act(async () => {
    cb && cb();
    jest.runAllTimers();
    await Promise.resolve();
    wrapper.update();
  });
}
