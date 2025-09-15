import * as React from 'react';
import canUseDom from '@rc-component/util/lib/Dom/canUseDom';
import type { TableSticky } from '../interface';

// fix ssr render
const defaultContainer = canUseDom() ? window : null;

/** Sticky header hooks */
export default function useSticky(
  sticky: boolean | TableSticky,
  prefixCls: string,
): {
  isSticky: boolean;
  offsetHeader: number;
  offsetSummary: number;
  offsetScroll: number;
  stickyClassName: string;
  container: Window | HTMLElement;
} {
  const {
    offsetHeader = 0,
    offsetSummary = 0,
    offsetScroll = 0,
    getContainer = () => defaultContainer,
  } = typeof sticky === 'object' ? sticky : {};

  const container = getContainer() || defaultContainer;

  const isSticky = !!sticky;

  return React.useMemo(() => {
    return {
      isSticky,
      stickyClassName: isSticky ? `${prefixCls}-sticky-holder` : '',
      offsetHeader,
      offsetSummary,
      offsetScroll,
      container,
    };
  }, [isSticky, offsetScroll, offsetHeader, offsetSummary, prefixCls, container]);
}
