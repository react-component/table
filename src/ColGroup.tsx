import * as React from 'react';
import * as PropTypes from 'prop-types';
import { INTERNAL_COL_DEFINE } from './utils';
import { FixedType, ColumnType, InternalColumnType } from './interface';

export interface ColGroupProps {
  fixed: FixedType;
  /** FIXME: Not used. Should confirm why this prop here */
  columns?: ColumnType[];
}

export default class ColGroup extends React.PureComponent<ColGroupProps> {
  static contextTypes = {
    table: PropTypes.any,
  };

  render() {
    const { prefixCls, expandIconAsCell } = this.context.table.props;
    const { fixed } = this.props;

    let cols: React.ReactElement[] = [];

    if (expandIconAsCell && fixed !== 'right') {
      cols.push(<col className={`${prefixCls}-expand-icon-col`} key="rc-table-expand-icon-col" />);
    }

    let leafColumns: InternalColumnType[];

    if (fixed === 'left') {
      leafColumns = this.context.table.columnManager.leftLeafColumns();
    } else if (fixed === 'right') {
      leafColumns = this.context.table.columnManager.rightLeafColumns();
    } else {
      leafColumns = this.context.table.columnManager.leafColumns();
    }

    cols = cols.concat(
      leafColumns.map(({ key, dataIndex, width, [INTERNAL_COL_DEFINE]: additionalProps }) => {
        const mergedKey = key !== undefined ? key : dataIndex;
        return <col key={mergedKey} style={{ width, minWidth: width }} {...additionalProps} />;
      }),
    );

    return <colgroup>{cols}</colgroup>;
  }
}
