import React from 'react';

interface ISize {
  width: number;
  height: number;
  offsetWidth: number;
  offsetHeight: number;
}
type ResizeCallback<T> = (size: ISize, info: T) => void;

// leading one will execute at once, without delay to next task.
function useDebounceCallback(callback, interval = 0) {
  const lastCheckTimeRef = React.useRef(0);
  const finalTimerRef = React.useRef<number>();

  const debouncedCallback = React.useCallback(() => {
    function control() {
      const currentTime = window.performance?.now?.() ?? window.Date.now();
      const isReachIntervalTime = currentTime - lastCheckTimeRef.current >= interval;

      if (isReachIntervalTime) {
        // reserve re-computed and re-render time, avoid continuous triggering。
        lastCheckTimeRef.current = currentTime + 5000;
        callback();
        cleanUpTimer();
      } else {
        lastCheckTimeRef.current = currentTime;
        cleanUpTimer();
        finalTimerRef.current = window.setTimeout(() => {
          control();
        }, interval);
      }
    }

    function cleanUpTimer() {
      if (finalTimerRef.current) {
        clearTimeout(finalTimerRef.current);
        finalTimerRef.current = null;
      }
    }

    control();
  }, []);

  return debouncedCallback;
}

export default function useColumnResizeObserver<T>(onResize: ResizeCallback<T>): {
  observe: (el: HTMLElement, info: T) => void;
  unobserve: (el: HTMLElement) => void;
} {
  const resizeObserverRef = React.useRef<ResizeObserver>(null);
  const targetInfoRef = React.useRef(new WeakMap<HTMLElement, T>());
  const resizedTargetSetRef = React.useRef(new Set<HTMLElement>());

  const resizeCallback = function () {
    for (const target of resizedTargetSetRef.current) {
      const { width, height } = target.getBoundingClientRect();
      const { offsetWidth, offsetHeight } = target;

      /**
       * Resize observer trigger when content size changed.
       * In most case we just care about HTMLElement size,
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
    resizedTargetSetRef.current.clear();
  };
  const debouncedResizeCallback = useDebounceCallback(resizeCallback, 1200);

  if (!resizeObserverRef.current) {
    resizeObserverRef.current = new ResizeObserver(entries => {
      entries.map(({ target }) => resizedTargetSetRef.current.add(target));
      // handle continuous resizing,
      debouncedResizeCallback();
    });
  }

  const observe = (el: HTMLElement, info) => {
    resizeObserverRef.current.observe(el);
    targetInfoRef.current.set(el, info);
  };

  const unobserve = (el: HTMLElement) => {
    resizeObserverRef.current.unobserve(el);
    targetInfoRef.current.delete(el);
  };

  return React.useMemo(() => ({ observe, unobserve }), []);
}
