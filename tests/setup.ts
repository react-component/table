import '@testing-library/jest-dom';

// https://github.com/nickcolley/jest-axe/issues/147#issuecomment-758804533
const { getComputedStyle } = window;
window.getComputedStyle = elt => getComputedStyle(elt);

global.requestAnimationFrame = cb => setTimeout(cb, 0);
require('regenerator-runtime');

vi.mock('@rc-component/util/lib/getScrollBarSize');

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver implements ResizeObserver {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe(ele) {
    // Mock trigger first time
    this.callback([{ target: ele }] as any, this);
  }
  unobserve() {}
  disconnect() {}
};
