import * as React from 'react';

export interface TDComponentProps extends React.HTMLAttributes<HTMLElement> {
  'data-ellipsis'?: boolean;
  'data-col-width'?: boolean;
  children?: React.ReactNode;
}

function TDComponent(
  {
    'data-ellipsis': ellipsis,
    'data-col-width': colWidth,
    children,
    style,
    ...restProps
  }: TDComponentProps,
  ref: React.Ref<HTMLTableDataCellElement>,
) {
  const { width, ...restStyle } = style || {};

  let tdStyle: React.CSSProperties = style;
  let divStyle: React.CSSProperties;

  if (width && !colWidth) {
    tdStyle = {
      ...restStyle,
    };

    divStyle = {
      width,
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
