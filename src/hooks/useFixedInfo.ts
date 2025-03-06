import useMemo from '@rc-component/util/lib/hooks/useMemo';
import isEqual from '@rc-component/util/lib/isEqual';
import type { ColumnType, StickyOffsets } from '../interface';
import { getCellFixedInfo } from '../utils/fixUtil';

export default function useFixedInfo<RecordType>(
  flattenColumns: readonly ColumnType<RecordType>[],
  stickyOffsets: StickyOffsets,
) {
  const fixedInfoList = flattenColumns.map((_, colIndex) =>
    getCellFixedInfo(colIndex, colIndex, flattenColumns, stickyOffsets),
  );

  return useMemo(
    () => fixedInfoList,
    [fixedInfoList],
    (prev, next) => !isEqual(prev, next),
  );
}
