import * as React from 'react';
import { TableSticky } from '../interface';

/** Sticky header hooks */
export default function useSticky(
  sticky: boolean | TableSticky,
  prefixCls: string,
): {
  isSticky: boolean;
  offsetHeader: number;
  offsetScroll: number;
  stickyClassName: string;
  container: Window | HTMLElement;
} {
  const { offsetHeader = 0, offsetScroll = 0, getContainer = () => window } =
    typeof sticky === 'object' ? sticky : {};

  const container = getContainer() || window;

  return React.useMemo(() => {
    const isSticky = !!sticky;
    return {
      isSticky,
      stickyClassName: isSticky ? `${prefixCls}-sticky-header` : '',
      offsetHeader,
      offsetScroll,
      container,
    };
  }, [offsetScroll, offsetHeader, prefixCls, container]);
}
