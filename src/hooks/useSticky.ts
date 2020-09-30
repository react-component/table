import * as React from 'react';
import canUseDom from 'rc-util/lib/Dom/canUseDom';
import { TableSticky } from '../interface';

// fix ssr render
const defaultContainer = canUseDom() ? window : null;

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
  const { offsetHeader = 0, offsetScroll = 0, getContainer = () => defaultContainer } =
    typeof sticky === 'object' ? sticky : {};

  const container = getContainer() || defaultContainer;

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
