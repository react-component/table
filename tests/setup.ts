import '@testing-library/jest-dom';

// https://github.com/nickcolley/jest-axe/issues/147#issuecomment-758804533
const { getComputedStyle } = window;
window.getComputedStyle = elt => getComputedStyle(elt);

global.requestAnimationFrame = cb => setTimeout(cb, 0);
require('regenerator-runtime');

jest.mock('@rc-component/util/lib/getScrollBarSize');

const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });

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
