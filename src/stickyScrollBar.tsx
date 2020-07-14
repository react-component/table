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

let scrollBarSizeCache = 0;

function getScrollBarSizeCache() {
  if (scrollBarSizeCache === 0) {
    scrollBarSizeCache = getScrollBarSize();
  }

  return scrollBarSizeCache;
}

const StickyScrollBar: React.FC<StickyScrollBarProps> = ({ scrollBodyRef, onScroll, sticky }) => {
  const { prefixCls } = React.useContext(TableContext);
  const bodyScrollWidth = scrollBodyRef.current?.scrollWidth;
  const bodyWidth = scrollBodyRef.current?.offsetWidth;
  const scrollBarWidth = bodyWidth * (bodyWidth / bodyScrollWidth);

  const isScollBarDragable = React.useRef(false);
  const [scrollLeft, setScrollLeft] = useFrameState(0);
  const scrollBarRef = React.useRef<HTMLDivElement>();
  const delta = React.useRef(0);
  const x = React.useRef(0);
  const [isHiddenScrollBar, setHiddenScrollBar] = useFrameState(false);

  const onMouseUp: React.MouseEventHandler<HTMLDivElement> = event => {
    isScollBarDragable.current = false;
    event.preventDefault();
  };

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = event => {
    event.persist();
    isScollBarDragable.current = true;
    delta.current = event.pageX - scrollLeft;
    x.current = 0;
    event.preventDefault();
  };

  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = event => {
    event.preventDefault();
    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
    const { buttons } = event || (window?.event as any);
    if (!isScollBarDragable.current || buttons === 0) {
      return;
    }
    let left: number = x.current + event.pageX - x.current - delta.current;

    if (left <= 0) {
      left = 0;
    }

    if (left + scrollBarWidth >= bodyWidth) {
      left = bodyWidth - scrollBarWidth;
    }

    setScrollLeft(() => {
      onScroll({
        scrollLeft: (left / bodyWidth) * (bodyScrollWidth + 2),
      });
      return left;
    });

    x.current = event.pageX;
  };

  const onContainerScroll = () => {
    const tableOffsetTop = getOffset(scrollBodyRef.current).top;
    const tableBottomOffset = tableOffsetTop + scrollBodyRef.current.offsetHeight;
    const currentClientOffset = document.documentElement.scrollTop + window.innerHeight;
    if (
      tableBottomOffset - getScrollBarSizeCache() <= currentClientOffset ||
      tableOffsetTop >= currentClientOffset
    ) {
      setHiddenScrollBar(() => true);
    } else {
      setHiddenScrollBar(() => false);
    }
  };

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
    if (!isHiddenScrollBar) {
      setScrollLeft(() => (scrollBodyRef.current.scrollLeft / bodyScrollWidth) * bodyWidth);
    }
  }, [isHiddenScrollBar]);


  if (
    bodyScrollWidth <= bodyWidth ||
    !scrollBarWidth ||
    isHiddenScrollBar ||
    !sticky?.isShowScroll
  ) {
    return null;
  }

  return (
    <div
      style={{
        height: getScrollBarSizeCache(),
        width: bodyWidth,
        bottom: sticky?.offsetScroll || 0,
      }}
      className={`${prefixCls}-sticky-scroll`}
    >
      <div
        onMouseDown={onMouseDown}
        ref={scrollBarRef}
        className={`${prefixCls}-sticky-scroll-bar`}
        style={{
          width: `${scrollBarWidth}px`,
          transform: `translate3d(${scrollLeft}px, 0px, 0px)`,
          backfaceVisibility: 'hidden',
        }}
      />
    </div>
  );
};

export default StickyScrollBar;
