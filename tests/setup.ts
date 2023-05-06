import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

declare module 'vitest' {
  interface Assertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
}

expect.extend(matchers);

// https://github.com/nickcolley/jest-axe/issues/147#issuecomment-758804533
const { getComputedStyle } = window;
window.getComputedStyle = elt => getComputedStyle(elt);

global.requestAnimationFrame = cb => setTimeout(cb, 0);
require('regenerator-runtime');

const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });
