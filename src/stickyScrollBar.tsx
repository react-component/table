import { useContext } from '@rc-component/context';
import classNames from 'classnames';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import { getOffset } from 'rc-util/lib/Dom/css';
import getScrollBarSize from 'rc-util/lib/getScrollBarSize';
import * as React from 'react';
import TableContext from './context/TableContext';
import { useLayoutState } from './hooks/useFrame';
import raf from 'rc-util/lib/raf';

interface StickyScrollBarProps {
  scrollBodyRef: React.RefObject<HTMLDivElement>;
  onScroll: (params: { scrollLeft?: number }) => void;
  offsetScroll: number;
  container: HTMLElement | Window;
  direction: string;
}

const StickyScrollBar: React.ForwardRefRenderFunction<unknown, StickyScrollBarProps> = (
  { scrollBodyRef, onScroll, offsetScroll, container, direction },
  ref,
) => {
  const prefixCls = useContext(TableContext, 'prefixCls');
  const bodyScrollWidth = scrollBodyRef.current?.scrollWidth || 0;
  const bodyWidth = scrollBodyRef.current?.clientWidth || 0;
  const scrollBarWidth = bodyScrollWidth && bodyWidth * (bodyWidth / bodyScrollWidth);

  const scrollBarRef = React.useRef<HTMLDivElement>();
  const [scrollState, setScrollState] = useLayoutState<{
    scrollLeft: number;
    isHiddenScrollBar: boolean;
  }>({
    scrollLeft: 0,
    isHiddenScrollBar: true,
  });
  const refState = React.useRef<{
    delta: number;
    x: number;
  }>({
    delta: 0,
    x: 0,
  });
  const [isActive, setActive] = React.useState(false);
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(
    () => () => {
      raf.cancel(rafRef.current);
    },
    [],
  );

  const onMouseUp: React.MouseEventHandler<HTMLDivElement> = () => {
    setActive(false);
  };

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = event => {
    event.persist();
    refState.current.delta = event.pageX - scrollState.scrollLeft;
    refState.current.x = 0;
    setActive(true);
    event.preventDefault();
  };

  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = event => {
    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
    const { buttons } = event || (window?.event as any);
    if (!isActive || buttons === 0) {
      // If out body mouse up, we can set isActive false when mouse move
      if (isActive) {
        setActive(false);
      }
      return;
    }
    let left: number =
      refState.current.x + event.pageX - refState.current.x - refState.current.delta;

    const isRTL = direction === 'rtl';
    // Limit scroll range
    left = Math.max(
      isRTL ? scrollBarWidth - bodyWidth : 0,
      Math.min(isRTL ? 0 : bodyWidth - scrollBarWidth, left),
    );
    // Calculate the scroll position and update
    const shouldScroll = !isRTL || Math.abs(left) + Math.abs(scrollBarWidth) < bodyWidth;
    if (shouldScroll) {
      onScroll({
        scrollLeft: (left / bodyWidth) * (bodyScrollWidth + 2),
      });
      refState.current.x = event.pageX;
    }
  };

  const checkScrollBarVisible = () => {
    rafRef.current = raf(() => {
      if (!scrollBodyRef.current) {
        return;
      }
      const tableOffsetTop = getOffset(scrollBodyRef.current).top;
      const tableBottomOffset = tableOffsetTop + scrollBodyRef.current.offsetHeight;
      const currentClientOffset =
        container === window
          ? document.documentElement.scrollTop + window.innerHeight
          : getOffset(container).top + (container as HTMLElement).clientHeight;

      if (
        tableBottomOffset - getScrollBarSize() <= currentClientOffset ||
        tableOffsetTop >= currentClientOffset - offsetScroll
      ) {
        setScrollState(state => ({
          ...state,
          isHiddenScrollBar: true,
        }));
      } else {
        setScrollState(state => ({
          ...state,
          isHiddenScrollBar: false,
        }));
      }
    });
  };

  const setScrollLeft = (left: number) => {
    setScrollState(state => {
      return {
        ...state,
        scrollLeft: (left / bodyScrollWidth) * bodyWidth || 0,
      };
    });
  };

  React.useImperativeHandle(ref, () => ({
    setScrollLeft,
    checkScrollBarVisible,
  }));

  React.useEffect(() => {
    const onMouseUpListener = addEventListener(document.body, 'mouseup', onMouseUp, false);
    const onMouseMoveListener = addEventListener(document.body, 'mousemove', onMouseMove, false);
    checkScrollBarVisible();
    return () => {
      onMouseUpListener.remove();
      onMouseMoveListener.remove();
    };
  }, [scrollBarWidth, isActive]);

  React.useEffect(() => {
    const onScrollListener = addEventListener(container, 'scroll', checkScrollBarVisible, false);
    const onResizeListener = addEventListener(window, 'resize', checkScrollBarVisible, false);

    return () => {
      onScrollListener.remove();
      onResizeListener.remove();
    };
  }, [container]);

  React.useEffect(() => {
    if (!scrollState.isHiddenScrollBar) {
      setScrollState(state => {
        const bodyNode = scrollBodyRef.current;
        if (!bodyNode) {
          return state;
        }
        return {
          ...state,
          scrollLeft: (bodyNode.scrollLeft / bodyNode.scrollWidth) * bodyNode.clientWidth,
        };
      });
    }
  }, [scrollState.isHiddenScrollBar]);

  if (bodyScrollWidth <= bodyWidth || !scrollBarWidth || scrollState.isHiddenScrollBar) {
    return null;
  }

  return (
    <div
      style={{
        height: getScrollBarSize(),
        width: bodyWidth,
        bottom: offsetScroll,
      }}
      className={`${prefixCls}-sticky-scroll`}
    >
      <div
        onMouseDown={onMouseDown}
        ref={scrollBarRef}
        className={classNames(`${prefixCls}-sticky-scroll-bar`, {
          [`${prefixCls}-sticky-scroll-bar-active`]: isActive,
        })}
        style={{
          width: `${scrollBarWidth}px`,
          transform: `translate3d(${scrollState.scrollLeft}px, 0, 0)`,
        }}
      />
    </div>
  );
};

export default React.forwardRef(StickyScrollBar);
