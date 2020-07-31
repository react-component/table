import * as React from 'react';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import getScrollBarSize from 'rc-util/lib/getScrollBarSize';
import { getOffset } from 'rc-util/lib/Dom/css';
import TableContext from './context/TableContext';
import { useFrameState } from './hooks/useFrame';
import { TableSticky } from './interface';

interface StickyScrollBarProps {
  scrollBodyRef: React.RefObject<HTMLDivElement>;
  onScroll: (params: { scrollLeft?: number }) => void;
  sticky?: TableSticky;
}

const StickyScrollBar: React.ForwardRefRenderFunction<unknown, StickyScrollBarProps> = (
  { scrollBodyRef, onScroll, sticky },
  ref,
) => {
  const { prefixCls } = React.useContext(TableContext);
  const bodyScrollWidth = scrollBodyRef.current?.scrollWidth || 0;
  const bodyWidth = scrollBodyRef.current?.offsetWidth || 0;
  const scrollBarWidth = bodyScrollWidth && bodyWidth * (bodyWidth / bodyScrollWidth);
  const offsetScroll = typeof sticky === 'object' && sticky.offsetScroll ? sticky.offsetScroll : 0;

  const scrollBarRef = React.useRef<HTMLDivElement>();
  const [frameState, setFrameState] = useFrameState<{
    scrollLeft: number;
    isHiddenScrollBar: boolean;
  }>({
    scrollLeft: 0,
    isHiddenScrollBar: false,
  });
  const refState = React.useRef<{
    isScollBarDragable: boolean;
    delta: number;
    x: number;
  }>({
    isScollBarDragable: false,
    delta: 0,
    x: 0,
  });

  const onMouseUp: React.MouseEventHandler<HTMLDivElement> = event => {
    refState.current.isScollBarDragable = false;
    event.preventDefault();
  };

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = event => {
    event.persist();
    refState.current.isScollBarDragable = true;
    refState.current.delta = event.pageX - frameState.scrollLeft;
    refState.current.x = 0;
    event.preventDefault();
  };

  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = event => {
    event.preventDefault();
    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
    const { buttons } = event || (window?.event as any);
    if (!refState.current.isScollBarDragable || buttons === 0) {
      return;
    }
    let left: number =
      refState.current.x + event.pageX - refState.current.x - refState.current.delta;

    if (left <= 0) {
      left = 0;
    }

    if (left + scrollBarWidth >= bodyWidth) {
      left = bodyWidth - scrollBarWidth;
    }

    setFrameState(state => {
      onScroll({
        scrollLeft: (left / bodyWidth) * (bodyScrollWidth + 2),
      });
      return {
        ...state,
        scrollLeft: left,
      };
    });

    refState.current.x = event.pageX;
  };

  const onContainerScroll = () => {
    const tableOffsetTop = getOffset(scrollBodyRef.current).top;
    const tableBottomOffset = tableOffsetTop + scrollBodyRef.current.offsetHeight;
    const currentClientOffset = document.documentElement.scrollTop + window.innerHeight;

    if (
      tableBottomOffset - getScrollBarSize() <= currentClientOffset ||
      tableOffsetTop >= currentClientOffset - offsetScroll
    ) {
      setFrameState(state => ({
        ...state,
        isHiddenScrollBar: true,
      }));
    } else {
      setFrameState(state => ({
        ...state,
        isHiddenScrollBar: false,
      }));
    }
  };

  const setScrollLeft = (left: number) => {
    setFrameState(state => {
      return {
        ...state,
        scrollLeft: (left / bodyScrollWidth) * bodyWidth || 0,
      };
    });
  };

  React.useImperativeHandle(ref, () => ({
    setScrollLeft,
  }));

  React.useEffect(() => {
    const onMouseUpListener = addEventListener(document.body, 'mouseup', onMouseUp, false);
    const onMouseMoveListener = addEventListener(document.body, 'mousemove', onMouseMove, false);
    onContainerScroll();
    return () => {
      onMouseUpListener.remove();
      onMouseMoveListener.remove();
    };
  }, [scrollBarWidth]);

  React.useEffect(() => {
    const onScrollListener = addEventListener(window, 'scroll', onContainerScroll, false);

    return () => {
      onScrollListener.remove();
    };
  }, []);

  React.useEffect(() => {
    if (!frameState.isHiddenScrollBar) {
      setFrameState(state => ({
        ...state,
        scrollLeft:
          (scrollBodyRef.current.scrollLeft / scrollBodyRef.current?.scrollWidth) *
          scrollBodyRef.current?.offsetWidth,
      }));
    }
  }, [frameState.isHiddenScrollBar]);

  if (bodyScrollWidth <= bodyWidth || !scrollBarWidth || frameState.isHiddenScrollBar) {
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
        className={`${prefixCls}-sticky-scroll-bar`}
        style={{
          width: `${scrollBarWidth}px`,
          transform: `translate3d(${frameState.scrollLeft}px, 0, 0)`,
        }}
      />
    </div>
  );
};

export default React.forwardRef(StickyScrollBar);
