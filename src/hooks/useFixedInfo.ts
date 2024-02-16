import useMemo from 'rc-util/lib/hooks/useMemo';
import isEqual from 'rc-util/lib/isEqual';
import type { ColumnType, Direction, StickyOffsets } from '../interface';
import { getCellFixedInfo } from '../utils/fixUtil';

export default function useFixedInfo<RecordType>(
  flattenColumns: readonly ColumnType<RecordType>[],
  stickyOffsets: StickyOffsets,
  direction: Direction,
) {
  const fixedInfoList = flattenColumns.map((_, colIndex) =>
    getCellFixedInfo(colIndex, colIndex, flattenColumns, stickyOffsets, direction),
  );

  return useMemo(
    () => fixedInfoList,
    [fixedInfoList],
    (prev, next) => !isEqual(prev, next),
  );
}
