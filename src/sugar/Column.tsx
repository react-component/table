import { ColumnType } from '../interface';

export interface ColumnProps<RecordType> extends ColumnType<RecordType> {
  children?: null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Column<RecordType>(_: ColumnProps<RecordType>) {
  return null;
}

export default Column;
