import React from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import debounce from 'lodash.debounce';

interface ISize {
  width: number;
  height: number;
  offsetWidth: number;
  offsetHeight: number;
}

export interface IColumnResizeObserver<T> {
  observe: (el: HTMLElement, info: T) => void;
  unobserve: (el: HTMLElement) => void;
  trigger: (size: Partial<ISize>, info: T) => void;
}

function getDebounceWithCache(callback, ...debounceParams) {
  const cache = new Set();

  const debounced = debounce(function () {
    callback(cache);
    cache.clear();
  }, ...debounceParams);

  return items => {
    items.forEach(item => cache.add(item));
    debounced();
  };
}

type ResizeCallback<T> = (size: ISize, info: T) => void;
export default function useColumnResizeObserver<T>(
  onResize: ResizeCallback<T>,
): IColumnResizeObserver<T> {
  const resizeObserverRef = React.useRef<ResizeObserver>(null);
  const targetInfoRef = React.useRef(new WeakMap<HTMLElement, T>());
  // for onResize update
  const onResizeRef = React.useRef<ResizeCallback<T>>();
  onResizeRef.current = onResize;

  if (!resizeObserverRef.current) {
    const resizeCallback = function (targetSet) {
      for (const target of targetSet) {
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
        if (onResizeRef.current) {
          const mergedOffsetWidth = offsetWidth === Math.round(width) ? width : offsetWidth;
          const mergedOffsetHeight = offsetHeight === Math.round(height) ? height : offsetHeight;
          Promise.resolve().then(() => {
            onResizeRef.current(
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
    };
    const debouncedCallback = getDebounceWithCache(resizeCallback, 1200, {
      leading: true,
      trailing: true,
    });

    resizeObserverRef.current = new ResizeObserver(entries => {
      debouncedCallback(entries.map(entry => entry.target));
    });
  }

  return React.useMemo(() => {
    return {
      observe: (el: HTMLElement, info) => {
        resizeObserverRef.current.observe(el);
        targetInfoRef.current.set(el, info);
      },
      unobserve: (el: HTMLElement) => {
        resizeObserverRef.current.unobserve(el);
        targetInfoRef.current.delete(el);
      },
      trigger: (size, info) => {
        onResizeRef.current(
          Object.assign(
            {
              width: 0,
              height: 0,
              offsetWidth: 0,
              offsetHeight: 0,
            },
            size,
          ),
          info,
        );
      },
    };
  }, []);
}

export function useObserveElement<T>(columnResizeObserver: IColumnResizeObserver<T>, info: T) {
  const lastCellRef = React.useRef<HTMLElement>(null);
  const cellRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (lastCellRef.current !== cellRef.current) {
      if (lastCellRef.current) {
        columnResizeObserver.unobserve(lastCellRef.current);
      }
      if (cellRef.current) {
        columnResizeObserver.observe(cellRef.current, info);
      }

      lastCellRef.current = cellRef.current;
    }
  });

  React.useEffect(() => {
    return () => {
      if (lastCellRef.current) {
        columnResizeObserver.unobserve(lastCellRef.current);
      }
    };
  }, []);

  return [cellRef];
}
