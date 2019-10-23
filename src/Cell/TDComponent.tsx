import * as React from 'react';

export interface TDComponentProps extends React.HTMLAttributes<HTMLElement> {
  'data-ellipsis'?: boolean;
  'data-col-width'?: boolean;
  colSpan?: number;
  children?: React.ReactNode;
}

function TDComponent(
  {
    'data-ellipsis': ellipsis,
    'data-col-width': colWidth,
    children,
    colSpan,
    style,
    ...restProps
  }: TDComponentProps,
  ref: React.Ref<HTMLTableDataCellElement>,
) {
  const { width, ...restStyle } = style || {};

  let tdStyle: React.CSSProperties = style;
  let divStyle: React.CSSProperties;

  if (colSpan >= 2) {
    tdStyle = restStyle;
  } else if (width && !colWidth) {
    tdStyle = restStyle;

    divStyle = {
      width,
    };
  }

  return (
    <td {...restProps} colSpan={colSpan} style={tdStyle} ref={ref}>
      <div style={divStyle}>{children}</div>
    </td>
  );
}

const RefTD = React.forwardRef(TDComponent);
RefTD.displayName = 'TD';

export default RefTD;
