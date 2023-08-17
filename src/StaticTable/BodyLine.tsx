import { useContext } from '@rc-component/context';
import classNames from 'classnames';
import * as React from 'react';
import Cell from '../Cell';
import TableContext from '../context/TableContext';
import { getColumnsKey } from '../utils/valueUtil';
import StaticContext from './StaticContext';

export interface BodyLineProps<RecordType = any> {
  record: RecordType;
  index: number;
  className?: string;
}

const BodyLine = React.forwardRef<HTMLDivElement, BodyLineProps>((props, ref) => {
  const { record, index, className, style, ...restProps } = props;

  const { flattenColumns, prefixCls, fixedInfoList } = useContext(TableContext);
  const { scrollX } = useContext(StaticContext, ['scrollX']);

  const columnsKey = getColumnsKey(flattenColumns);

  // ========================== Render ==========================
  return (
    <div
      {...restProps}
      ref={ref}
      className={classNames(className, `${prefixCls}-row`)}
      style={{
        ...style,
        width: scrollX,
      }}
    >
      {flattenColumns.map((column, colIndex) => {
        const { render, dataIndex, className: columnClassName } = column;

        const key = columnsKey[colIndex];
        const fixedInfo = fixedInfoList[colIndex];

        // return (
        //   <div key={index} className={`${prefixCls}-cell`} style={{ width: column.width }}>
        //     {value}
        //   </div>
        // );

        return (
          <Cell
            className={columnClassName}
            ellipsis={column.ellipsis}
            align={column.align}
            scope={column.rowScope}
            component="div"
            prefixCls={prefixCls}
            key={key}
            record={record}
            index={index}
            // renderIndex={renderIndex}
            renderIndex={index}
            dataIndex={dataIndex}
            render={render}
            shouldCellUpdate={column.shouldCellUpdate}
            {...fixedInfo}
            // appendNode={appendCellNode}
            // additionalProps={additionalCellProps}
          />
        );
      })}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') {
  BodyLine.displayName = 'BodyLine';
}

export default BodyLine;
