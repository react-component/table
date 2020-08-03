import * as React from 'react';
import { TableSticky } from '../interface';

export default function useSticky(
  sticky: boolean | TableSticky,
  prefixCls: string,
): {
  isSticky: boolean;
  offsetHeader: number;
  offsetScroll: number;
  stickyClassName: string;
} {
  return React.useMemo(() => {
    const isSticky = !!sticky;
    return {
      isSticky,
      stickyClassName: isSticky ? `${prefixCls}-sticky-header` : '',
      offsetHeader: typeof sticky === 'object' ? sticky.offsetHeader || 0 : 0,
      offsetScroll: typeof sticky === 'object' ? sticky.offsetScroll || 0 : 0,
    };
  }, [sticky, prefixCls]);
}
