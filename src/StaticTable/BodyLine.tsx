import { useContext } from '@rc-component/context';
import classNames from 'classnames';
import * as React from 'react';
import TableContext from '../context/TableContext';
import StaticContext from './StaticContext';

export interface BodyLineProps<RecordType = any> {
  data: RecordType;
  className?: string;
}

const BodyLine = React.forwardRef<HTMLDivElement, BodyLineProps>((props, ref) => {
  const { data, className, style, ...restProps } = props;

  const { flattenColumns, prefixCls } = useContext(TableContext);
  const { scrollX } = useContext(StaticContext, ['scrollX']);

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
      {flattenColumns.map((column, index) => {
        const value = data[column.dataIndex];

        return (
          <div key={index} className={`${prefixCls}-cell`} style={{ width: column.width }}>
            {value}
          </div>
        );
      })}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') {
  BodyLine.displayName = 'BodyLine';
}

export default BodyLine;
