import React from 'react';

interface ISize {
  width: number;
  height: number;
  offsetWidth: number;
  offsetHeight: number;
}
type ResizeCallback<T> = (size: ISize, info: T) => void;

export default function useColumnResizeObserver<T>(onResize: ResizeCallback<T>): {
  observe: (el: Element, info: T) => void;
  unobserve: (el: Element) => void;
} {
  const resizeObserverRef = React.useRef<ResizeObserver>(null);
  const targetInfoRef = React.useRef(new WeakMap<Element, T>());

  if (!resizeObserverRef.current) {
    resizeObserverRef.current = new ResizeObserver(entries => {
      for (const entry of entries) {
        const target = entry.target;
        const { width, height } = target.getBoundingClientRect();
        const { offsetWidth, offsetHeight } = target;

        /**
         * Resize observer trigger when content size changed.
         * In most case we just care about element size,
         * let's use `boundary` instead of `contentRect` here to avoid shaking.
         */
        const fixedWidth = Math.floor(width);
        const fixedHeight = Math.floor(height);

        const size = { width: fixedWidth, height: fixedHeight, offsetWidth, offsetHeight };
        if (onResize) {
          const mergedOffsetWidth = offsetWidth === Math.round(width) ? width : offsetWidth;
          const mergedOffsetHeight = offsetHeight === Math.round(height) ? height : offsetHeight;
          Promise.resolve().then(() => {
            onResize(
              {
                ...size,
                offsetWidth: mergedOffsetWidth,
                offsetHeight: mergedOffsetHeight,
              },
              targetInfoRef.current.get(target),
            );
          });
        }
      }
    });
  }

  const observe = (el: Element, info) => {
    resizeObserverRef.current.observe(el);
    targetInfoRef.current.set(el, info);
  };

  const unobserve = (el: Element) => {
    resizeObserverRef.current.unobserve(el);
    targetInfoRef.current.delete(el);
  };

  return React.useMemo(() => ({ observe, unobserve }), []);
}
