import * as React from 'react';
import { TableSticky } from '../interface';

export default function useSticky(
  sticky: boolean | TableSticky,
  prefixCls: string,
): {
  isSticky: boolean;
  stickyConf: TableSticky;
  stickyClassName: string;
} {
  return React.useMemo(() => {
    const isSticky = !!sticky;
    return {
      isSticky,
      stickyClassName: isSticky ? `${prefixCls}-sticky-header` : '',
      stickyConf:
        typeof sticky === 'object'
          ? {
              offsetHeader: sticky.offsetHeader || 0,
              offsetScroll: sticky.offsetScroll || 0,
            }
          : {
              offsetHeader: 0,
              offsetScroll: 0,
            },
    };
  }, [sticky, prefixCls]);
}
