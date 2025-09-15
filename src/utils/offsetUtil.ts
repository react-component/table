import { getDOM } from '@rc-component/util/lib/Dom/findDOMNode';

// Copy from `rc-component/util/Dom/css.js`
export function getOffset(node: HTMLElement | Window) {
  const element = getDOM(node);
  const box = element.getBoundingClientRect();
  const docElem = document.documentElement;

  // < ie8 not support win.pageXOffset, use docElem.scrollLeft instead
  return {
    left:
      box.left +
      (window.pageXOffset || docElem.scrollLeft) -
      (docElem.clientLeft || document.body.clientLeft || 0),
    top:
      box.top +
      (window.pageYOffset || docElem.scrollTop) -
      (docElem.clientTop || document.body.clientTop || 0),
  };
}
