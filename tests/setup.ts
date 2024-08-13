import '@testing-library/jest-dom';

// https://github.com/nickcolley/jest-axe/issues/147#issuecomment-758804533
const { getComputedStyle } = window;
window.getComputedStyle = elt => getComputedStyle(elt);

global.requestAnimationFrame = cb => setTimeout(cb, 0);
require('regenerator-runtime');

vi.mock('rc-util/lib/getScrollBarSize');
