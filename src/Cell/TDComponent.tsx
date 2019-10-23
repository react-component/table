import * as React from 'react';

export interface TDComponentProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

function TDComponent(
  { children, style, ...restProps }: TDComponentProps,
  ref: React.Ref<HTMLTableDataCellElement>,
) {
  const { width, textOverflow, overflow, ...restStyle } = style || {};

  let tdStyle: React.CSSProperties = style;
  let divStyle: React.CSSProperties;

  if (width && textOverflow) {
    tdStyle = {
      ...restStyle,
    };

    divStyle = {
      width,
      textOverflow,
      overflow,
    };
  }

  return (
    <td {...restProps} style={tdStyle} ref={ref}>
      <div style={divStyle}>{children}</div>
    </td>
  );
}

const RefTD = React.forwardRef(TDComponent);
RefTD.displayName = 'TD';

export default RefTD;
